"""SQLAlchemy ORM models for Patient Admission Management."""

from sqlalchemy import Column, Date, DateTime, Integer, String, func
from app.constants import DEFAULT_STATUS
from app.database import Base


class Patient(Base):
    """Represents a patient admission record in the hospital database."""

    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, index=True)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    ward = Column(String(50), nullable=False, index=True)
    department = Column(String(50), nullable=False, index=True)
    doctor = Column(String(50), nullable=False, index=True)
    admission_date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False, default=DEFAULT_STATUS, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
