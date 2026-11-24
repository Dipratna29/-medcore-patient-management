"""Business logic and database operations for patient management."""

from typing import Optional
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.constants import DEFAULT_STATUS, DISCHARGED_STATUS
from app.models import Patient
from app.schemas import DashboardStatsResponse, PatientCreate, PatientUpdate


def list_patients(
    db: Session,
    search: Optional[str] = None,
    ward: Optional[str] = None,
    department: Optional[str] = None,
    doctor: Optional[str] = None,
    status: Optional[str] = None,
) -> list[Patient]:
    """Fetch patients with optional case-insensitive name search and combined filters."""
    query = db.query(Patient)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(Patient.name.ilike(term))

    if ward and ward.strip():
        query = query.filter(Patient.ward == ward.strip())

    if department and department.strip():
        query = query.filter(Patient.department == department.strip())

    if doctor and doctor.strip():
        query = query.filter(Patient.doctor == doctor.strip())

    if status and status.strip():
        query = query.filter(Patient.status == status.strip())

    return query.order_by(Patient.created_at.desc(), Patient.id.desc()).all()


def get_patient_by_id(db: Session, patient_id: int) -> Optional[Patient]:
    """Return a single patient by ID, or None if not found."""
    return db.query(Patient).filter(Patient.id == patient_id).first()


def create_patient(db: Session, payload: PatientCreate) -> Patient:
    """Create and persist a new patient admission record."""
    patient = Patient(
        name=payload.name,
        age=payload.age,
        gender=payload.gender,
        ward=payload.ward,
        department=payload.department,
        doctor=payload.doctor,
        admission_date=payload.admission_date,
        status=payload.status or DEFAULT_STATUS,
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


def update_patient(
    db: Session, patient: Patient, payload: PatientUpdate
) -> Patient:
    """Update all editable fields of an existing patient record."""
    patient.name = payload.name
    patient.age = payload.age
    patient.gender = payload.gender
    patient.ward = payload.ward
    patient.department = payload.department
    patient.doctor = payload.doctor
    patient.admission_date = payload.admission_date
    patient.status = payload.status

    db.commit()
    db.refresh(patient)
    return patient


def delete_patient(db: Session, patient: Patient) -> int:
    """Permanently delete a patient record and return the deleted ID."""
    deleted_id = patient.id
    db.delete(patient)
    db.commit()
    return deleted_id


def discharge_patient(db: Session, patient: Patient) -> Patient:
    """Mark a patient's status as Discharged and persist the change."""
    patient.status = DISCHARGED_STATUS
    db.commit()
    db.refresh(patient)
    return patient


def get_dashboard_stats(db: Session) -> DashboardStatsResponse:
    """Calculate total, admitted, and discharged patient counts from the database."""
    total_patients = db.query(func.count(Patient.id)).scalar() or 0
    admitted_patients = (
        db.query(func.count(Patient.id))
        .filter(Patient.status == DEFAULT_STATUS)
        .scalar()
        or 0
    )
    discharged_patients = (
        db.query(func.count(Patient.id))
        .filter(Patient.status == DISCHARGED_STATUS)
        .scalar()
        or 0
    )

    return DashboardStatsResponse(
        total_patients=total_patients,
        admitted_patients=admitted_patients,
        discharged_patients=discharged_patients,
    )
