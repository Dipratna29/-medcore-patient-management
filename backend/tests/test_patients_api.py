"""Comprehensive API and validation test suite for Patient Admission Management."""

from datetime import date, timedelta
import os
import tempfile
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app


@pytest.fixture()
def client():
    """Provide a FastAPI TestClient backed by an isolated temporary SQLite database."""
    fd, db_path = tempfile.mkstemp(suffix=".db")
    os.close(fd)
    test_url = f"sqlite:///{db_path}"
    engine = create_engine(test_url, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    engine.dispose()
    if os.path.exists(db_path):
        os.remove(db_path)


def valid_payload(**overrides):
    data = {
        "name": "Aarav Sharma",
        "age": 34,
        "gender": "Male",
        "ward": "General Ward",
        "department": "Cardiology",
        "doctor": "Dr. Sharma",
        "admission_date": date.today().isoformat(),
        "status": "Admitted",
    }
    data.update(overrides)
    return data


def test_add_valid_patient_and_get_all(client):
    res = client.post("/api/patients", json=valid_payload())
    assert res.status_code == 201
    created = res.json()
    assert created["id"] >= 1
    assert created["name"] == "Aarav Sharma"
    assert created["status"] == "Admitted"
    assert "created_at" in created

    list_res = client.get("/api/patients")
    assert list_res.status_code == 200
    assert len(list_res.json()) == 1


def test_reject_empty_and_invalid_names(client):
    for bad_name in ["", "   ", "John123", "Jane@Doe", "Alex_99"]:
        res = client.post("/api/patients", json=valid_payload(name=bad_name))
        assert res.status_code == 422


def test_reject_invalid_ages(client):
    for bad_age in [-1, 121, 25.5, "abc", True]:
        res = client.post("/api/patients", json=valid_payload(age=bad_age))
        assert res.status_code == 422


def test_reject_future_admission_date(client):
    future_date = (date.today() + timedelta(days=1)).isoformat()
    res = client.post("/api/patients", json=valid_payload(admission_date=future_date))
    assert res.status_code == 422
    assert "future" in res.json()["detail"].lower()


def test_reject_invalid_dropdown_values(client):
    invalid_cases = [
        {"gender": "Unknown"},
        {"ward": "VIP Suite"},
        {"department": "Dental"},
        {"doctor": "Dr. House"},
        {"status": "Pending"},
    ]
    for case in invalid_cases:
        res = client.post("/api/patients", json=valid_payload(**case))
        assert res.status_code == 422


def test_search_and_combined_filters(client):
    client.post(
        "/api/patients",
        json=valid_payload(
            name="Priya Nair",
            gender="Female",
            ward="ICU",
            department="Neurology",
            doctor="Dr. Patel",
        ),
    )
    client.post(
        "/api/patients",
        json=valid_payload(
            name="Rohan Verma",
            gender="Male",
            ward="ICU",
            department="Cardiology",
            doctor="Dr. Patel",
        ),
    )
    client.post(
        "/api/patients",
        json=valid_payload(
            name="Priya Kapoor",
            gender="Female",
            ward="General Ward",
            department="Neurology",
            doctor="Dr. Mehta",
        ),
    )

    # Case-insensitive partial search
    search_res = client.get("/api/patients", params={"search": "priya"})
    assert len(search_res.json()) == 2

    # Individual filters
    assert len(client.get("/api/patients", params={"ward": "ICU"}).json()) == 2
    assert len(client.get("/api/patients", params={"department": "Neurology"}).json()) == 2
    assert len(client.get("/api/patients", params={"doctor": "Dr. Patel"}).json()) == 2

    # Combined filters
    combo_res = client.get(
        "/api/patients",
        params={"ward": "ICU", "department": "Neurology", "doctor": "Dr. Patel"},
    )
    assert len(combo_res.json()) == 1
    assert combo_res.json()[0]["name"] == "Priya Nair"


def test_edit_discharge_delete_and_stats(client):
    p1 = client.post("/api/patients", json=valid_payload(name="Meera Joshi")).json()
    p2 = client.post(
        "/api/patients",
        json=valid_payload(name="Kabir Khan", ward="Emergency Ward"),
    ).json()

    # Stats after 2 admissions
    stats = client.get("/api/dashboard/stats").json()
    assert stats == {
        "total_patients": 2,
        "admitted_patients": 2,
        "discharged_patients": 0,
    }

    # Edit patient 1
    edit_res = client.put(
        f"/api/patients/{p1['id']}",
        json=valid_payload(name="Meera Joshi Updated", age=41, ward="Private Ward"),
    )
    assert edit_res.status_code == 200
    assert edit_res.json()["age"] == 41
    assert edit_res.json()["ward"] == "Private Ward"

    # Discharge patient 1
    discharge_res = client.patch(f"/api/patients/{p1['id']}/discharge")
    assert discharge_res.status_code == 200
    assert discharge_res.json()["status"] == "Discharged"

    stats_after_discharge = client.get("/api/dashboard/stats").json()
    assert stats_after_discharge == {
        "total_patients": 2,
        "admitted_patients": 1,
        "discharged_patients": 1,
    }

    # Delete patient 2
    del_res = client.delete(f"/api/patients/{p2['id']}")
    assert del_res.status_code == 200

    stats_after_delete = client.get("/api/dashboard/stats").json()
    assert stats_after_delete == {
        "total_patients": 1,
        "admitted_patients": 1 - 1,
        "discharged_patients": 1,
    }

    # Missing patient ID returns 404
    assert client.get("/api/patients/99999").status_code == 404
    assert client.delete("/api/patients/99999").status_code == 404
