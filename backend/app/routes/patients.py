"""REST API endpoints for patient CRUD, search, filtering, and discharge."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import DeleteResponse, PatientCreate, PatientResponse, PatientUpdate
from app.services import patient_service

router = APIRouter(prefix="/api/patients", tags=["Patients"])


@router.get("", response_model=list[PatientResponse])
def get_patients(
    search: Optional[str] = Query(default=None, description="Partial patient name search"),
    ward: Optional[str] = Query(default=None, description="Filter by ward"),
    department: Optional[str] = Query(default=None, description="Filter by department"),
    doctor: Optional[str] = Query(default=None, description="Filter by doctor"),
    patient_status: Optional[str] = Query(
        default=None, alias="status", description="Filter by admission status"
    ),
    db: Session = Depends(get_db),
):
    """Fetch all patients with optional search and multi-field filtering."""
    try:
        return patient_service.list_patients(
            db=db,
            search=search,
            ward=ward,
            department=department,
            doctor=doctor,
            status=patient_status,
        )
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while fetching patients.",
        ) from exc


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    """Fetch a single patient record by ID."""
    try:
        patient = patient_service.get_patient_by_id(db, patient_id)
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while retrieving patient.",
        ) from exc

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {patient_id} was not found.",
        )
    return patient


@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(payload: PatientCreate, db: Session = Depends(get_db)):
    """Admit a new patient after validating all required fields."""
    try:
        return patient_service.create_patient(db, payload)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while saving patient record.",
        ) from exc


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: int, payload: PatientUpdate, db: Session = Depends(get_db)
):
    """Update an existing patient's details."""
    try:
        patient = patient_service.get_patient_by_id(db, patient_id)
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patient with ID {patient_id} was not found.",
            )
        return patient_service.update_patient(db, patient, payload)
    except HTTPException:
        raise
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while updating patient record.",
        ) from exc


@router.delete("/{patient_id}", response_model=DeleteResponse)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    """Permanently delete a patient record."""
    try:
        patient = patient_service.get_patient_by_id(db, patient_id)
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patient with ID {patient_id} was not found.",
            )
        deleted_id = patient_service.delete_patient(db, patient)
        return DeleteResponse(
            message=f"Patient record #{deleted_id} deleted successfully.",
            id=deleted_id,
        )
    except HTTPException:
        raise
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while deleting patient record.",
        ) from exc


@router.patch("/{patient_id}/discharge", response_model=PatientResponse)
def discharge_patient(patient_id: int, db: Session = Depends(get_db)):
    """Mark an admitted patient as Discharged."""
    try:
        patient = patient_service.get_patient_by_id(db, patient_id)
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Patient with ID {patient_id} was not found.",
            )
        return patient_service.discharge_patient(db, patient)
    except HTTPException:
        raise
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while discharging patient.",
        ) from exc
