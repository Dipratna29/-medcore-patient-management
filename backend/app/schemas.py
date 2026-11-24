"""Pydantic schemas and strict validation rules for Patient resources."""

import re
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, field_validator
from app.constants import (
    ALLOWED_DEPARTMENTS,
    ALLOWED_DOCTORS,
    ALLOWED_GENDERS,
    ALLOWED_STATUSES,
    ALLOWED_WARDS,
    DEFAULT_STATUS,
)

NAME_PATTERN = re.compile(r"^[A-Za-z ]+$")


def _validate_choice(value: str, allowed: tuple[str, ...], field_label: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field_label} is required.")
    cleaned = value.strip()
    if cleaned not in allowed:
        raise ValueError(
            f"Invalid {field_label.lower()} '{cleaned}'. Allowed values: {', '.join(allowed)}."
        )
    return cleaned


class PatientBase(BaseModel):
    """Shared validated patient attributes."""

    name: str
    age: int
    gender: str
    ward: str
    department: str
    doctor: str
    admission_date: date
    status: str = DEFAULT_STATUS

    @field_validator("name", mode="before")
    @classmethod
    def validate_name(cls, value: object) -> str:
        if not isinstance(value, str):
            raise ValueError("Patient name must be a text string.")
        cleaned = " ".join(value.strip().split())
        if not cleaned:
            raise ValueError("Patient name is required.")
        if len(cleaned) > 100:
            raise ValueError("Patient name must not exceed 100 characters.")
        if not NAME_PATTERN.fullmatch(cleaned):
            raise ValueError(
                "Patient name must contain only alphabetic letters and spaces."
            )
        return cleaned

    @field_validator("age", mode="before")
    @classmethod
    def validate_age_type(cls, value: object) -> int:
        if value is None or value == "":
            raise ValueError("Age is required.")
        if isinstance(value, bool):
            raise ValueError("Age must be a valid whole number.")
        if isinstance(value, float):
            raise ValueError("Age must be a whole number without decimals.")
        if isinstance(value, str):
            stripped = value.strip()
            if not stripped or not re.fullmatch(r"[+-]?\d+", stripped):
                raise ValueError("Age must be a valid whole number.")
            return int(stripped)
        if isinstance(value, int):
            return value
        raise ValueError("Age must be a valid whole number.")

    @field_validator("age")
    @classmethod
    def validate_age_range(cls, value: int) -> int:
        if value < 0 or value > 120:
            raise ValueError("Age must be between 0 and 120.")
        return value

    @field_validator("gender", mode="before")
    @classmethod
    def validate_gender(cls, value: object) -> str:
        return _validate_choice(value, ALLOWED_GENDERS, "Gender")

    @field_validator("ward", mode="before")
    @classmethod
    def validate_ward(cls, value: object) -> str:
        return _validate_choice(value, ALLOWED_WARDS, "Ward")

    @field_validator("department", mode="before")
    @classmethod
    def validate_department(cls, value: object) -> str:
        return _validate_choice(value, ALLOWED_DEPARTMENTS, "Department")

    @field_validator("doctor", mode="before")
    @classmethod
    def validate_doctor(cls, value: object) -> str:
        return _validate_choice(value, ALLOWED_DOCTORS, "Doctor")

    @field_validator("admission_date", mode="after")
    @classmethod
    def validate_admission_date(cls, value: date) -> date:
        if value > date.today():
            raise ValueError("Admission date cannot be in the future.")
        return value

    @field_validator("status", mode="before")
    @classmethod
    def validate_status(cls, value: object) -> str:
        if value is None or value == "":
            return DEFAULT_STATUS
        return _validate_choice(value, ALLOWED_STATUSES, "Status")


class PatientCreate(PatientBase):
    """Schema for creating a new patient admission."""

    status: str = DEFAULT_STATUS


class PatientUpdate(PatientBase):
    """Schema for updating an existing patient record."""

    status: str


class PatientResponse(BaseModel):
    """Schema returned in API responses for a patient record."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    age: int
    gender: str
    ward: str
    department: str
    doctor: str
    admission_date: date
    status: str
    created_at: datetime


class DeleteResponse(BaseModel):
    """Schema returned after deleting a patient."""

    message: str
    id: int


class DashboardStatsResponse(BaseModel):
    """Schema for real-time hospital dashboard statistics."""

    total_patients: int
    admitted_patients: int
    discharged_patients: int


class OptionsResponse(BaseModel):
    """Schema exposing centralized dropdown options."""

    genders: tuple[str, ...]
    wards: tuple[str, ...]
    departments: tuple[str, ...]
    doctors: tuple[str, ...]
    statuses: tuple[str, ...]


class HealthResponse(BaseModel):
    """Schema for service health check."""

    status: str
    database: str
    timestamp: Optional[datetime] = None
