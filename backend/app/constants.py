"""Centralized dropdown options and constants for patient admission management."""

ALLOWED_GENDERS: tuple[str, ...] = (
    "Male",
    "Female",
    "Other",
)

ALLOWED_WARDS: tuple[str, ...] = (
    "General Ward",
    "ICU",
    "Emergency Ward",
    "Private Ward",
    "Pediatric Ward",
    "Maternity Ward",
)

ALLOWED_DEPARTMENTS: tuple[str, ...] = (
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "General Medicine",
    "Dermatology",
    "Oncology",
    "Gynecology",
)

ALLOWED_DOCTORS: tuple[str, ...] = (
    "Dr. Sharma",
    "Dr. Patel",
    "Dr. Mehta",
    "Dr. Gupta",
    "Dr. Singh",
    "Dr. Kumar",
)

ALLOWED_STATUSES: tuple[str, ...] = (
    "Admitted",
    "Discharged",
)

DEFAULT_STATUS = "Admitted"
DISCHARGED_STATUS = "Discharged"
