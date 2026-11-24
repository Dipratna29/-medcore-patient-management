"""FastAPI application entry point for Patient Admission Management System."""

import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import Depends, FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from app.constants import (
    ALLOWED_DEPARTMENTS,
    ALLOWED_DOCTORS,
    ALLOWED_GENDERS,
    ALLOWED_STATUSES,
    ALLOWED_WARDS,
)
from app.database import Base, engine, get_db
from app.routes.dashboard import router as dashboard_router
from app.routes.patients import router as patients_router
from app.schemas import HealthResponse, OptionsResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database tables on application startup."""
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="MedFlow Patient Admission Management API",
    description="REST API for managing hospital patient admissions, discharges, and dashboard analytics.",
    version="1.0.0",
    lifespan=lifespan,
)

raw_origins = os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
)
allowed_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Format Pydantic/FastAPI validation errors clearly for API consumers and UI."""
    field_errors: dict[str, str] = {}
    messages: list[str] = []

    for err in exc.errors():
        loc = [str(part) for part in err.get("loc", ()) if part not in ("body", "query", "path")]
        field_name = loc[-1] if loc else "request"
        raw_msg = err.get("msg", "Invalid value.")
        clean_msg = raw_msg.removeprefix("Value error, ").strip()

        if err.get("type") == "date_from_datetime_parsing":
            clean_msg = "Please enter a valid date in YYYY-MM-DD format."
        elif err.get("type") == "missing":
            clean_msg = f"{field_name.replace('_', ' ').title()} is required."

        if field_name not in field_errors:
            field_errors[field_name] = clean_msg
        messages.append(f"{field_name}: {clean_msg}")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": messages[0] if len(messages) == 1 else "Validation failed. Please check the highlighted fields.",
            "errors": field_errors,
            "messages": messages,
        },
    )


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(
    request: Request, exc: SQLAlchemyError
) -> JSONResponse:
    """Catch unhandled database errors and return a safe 500 JSON response."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "A database error occurred while processing your request."},
    )


app.include_router(patients_router)
app.include_router(dashboard_router)


@app.get("/api/options", response_model=OptionsResponse, tags=["Metadata"])
def get_dropdown_options():
    """Return centralized dropdown options for genders, wards, departments, doctors, and statuses."""
    return OptionsResponse(
        genders=ALLOWED_GENDERS,
        wards=ALLOWED_WARDS,
        departments=ALLOWED_DEPARTMENTS,
        doctors=ALLOWED_DOCTORS,
        statuses=ALLOWED_STATUSES,
    )


@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    """Check API and database connectivity."""
    try:
        db.execute(text("SELECT 1"))
        return HealthResponse(
            status="healthy",
            database="connected",
            timestamp=datetime.now(timezone.utc),
        )
    except SQLAlchemyError:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "unhealthy", "database": "disconnected"},
        )
