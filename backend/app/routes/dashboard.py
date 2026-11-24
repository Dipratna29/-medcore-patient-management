"""REST API endpoints for real-time hospital dashboard statistics."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import DashboardStatsResponse
from app.services import patient_service

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Return total, admitted, and discharged patient counts from the database."""
    try:
        return patient_service.get_dashboard_stats(db)
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while calculating dashboard statistics.",
        ) from exc
