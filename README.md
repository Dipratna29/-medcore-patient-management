<<<<<<< HEAD
# MedCore HMS — Patient Admission Management System

A full-stack **Patient Admission Management Web Application** built with **React, Vite, Tailwind CSS, Python FastAPI, SQLAlchemy ORM, and SQLite/PostgreSQL**. Designed as a modern hospital administration SaaS dashboard with strict frontend and backend validation, real-time search, multi-filter querying, live dashboard analytics, and persistent database storage.

---

## Live & Repository Links

- **Live Application URL:** `https://your-vercel-app-url.vercel.app` *(placeholder — replace after Vercel deployment)*
- **Backend API Docs (Swagger):** `https://your-render-api-url.onrender.com/docs` *(placeholder — replace after Render deployment)*
- **GitHub Repository URL:** `https://github.com/your-username/patient-admission-management` *(placeholder — replace with your repository URL)*

---

## Features

- **Real-Time Hospital Dashboard**: Displays live counts for Total Patients, Currently Admitted, and Discharged Patients directly calculated from database records.
- **Add Patient Registration**: Validated admission form with date picker (disallowing future dates), centralized dropdowns for gender, ward, department, and attending doctor, and default `Admitted` status.
- **View All Patients**: Responsive, paginated data table displaying ID, Name, Age, Gender, Ward, Department, Doctor, Admission Date, Status badges, and action controls, plus a helpful empty state.
- **Real-Time Case-Insensitive Search**: Filter patients instantly by partial name match.
- **Combined Multi-Filter Support**: Filter simultaneously by **Ward**, **Department**, and **Doctor**, with a one-click **Clear Filters** action.
- **Edit Patient Records**: Prefilled edit modal allowing updates to any patient field with both client-side and server-side validation error display.
- **Discharge Patient**: Dedicated action with confirmation dialog to mark an admitted patient as `Discharged` and immediately refresh dashboard metrics.
- **Delete Patient**: Permanent removal with confirmation dialog and immediate table/statistics synchronization.
- **Strict Dual-Layer Validation**: Client-side UX feedback paired with mandatory Pydantic validation in FastAPI.

---

## Technology Stack

### Frontend
- **React.js** (v18) + **Vite**
- **JavaScript (ES2022+)**
- **Tailwind CSS**
- **React Router** (`react-router-dom`)
- **Axios**
- **Lucide React** icons

### Backend & Database
- **Python 3.10+**
- **FastAPI** (REST API)
- **Pydantic v2** (strict validation)
- **SQLAlchemy 2.0 ORM**
- **SQLite** (local persistent database)
- **PostgreSQL** (`psycopg2-binary` ready for production)

---

## Project Structure

```text
patient-admission-management/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── dashboard.py
│   │   │   └── patients.py
│   │   ├── services/
│   │   │   └── patient_service.py
│   │   ├── constants.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── tests/
│   │   └── test_patients_api.py
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── DashboardCards.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PatientForm.jsx
│   │   │   ├── PatientTable.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── Toast.jsx
│   │   ├── constants/
│   │   │   └── patientOptions.js
│   │   ├── context/
│   │   │   └── ToastContext.jsx
│   │   ├── pages/
│   │   │   ├── AddPatient.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Patients.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── patientService.js
│   │   ├── utils/
│   │   │   └── validation.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Python 3.10+**
- **Node.js 18+** and **npm**
- **PostgreSQL** (optional, only required for production or PostgreSQL testing; SQLite works out of the box locally)

---

## Local Setup & Installation

### 1. Backend Installation (FastAPI)

```bash
cd backend
python -m venv .venv

# Windows (PowerShell)
.\.venv\Scripts\Activate.ps1
# macOS / Linux
# source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

Start the FastAPI backend server:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Interactive API documentation will be available at:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

### 2. Frontend Installation (React + Vite)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the application in your browser at `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default / Example |
|---|---|---|
| `DATABASE_URL` | SQLAlchemy database connection URI | `sqlite:///./patients.db` (or `postgresql+psycopg2://user:pass@host:5432/dbname`) |
| `CORS_ORIGINS` | Comma-separated list of allowed frontend origins | `http://localhost:5173,http://127.0.0.1:5173` |
| `APP_ENV` | Application runtime environment | `development` |

### Frontend (`frontend/.env`)

| Variable | Description | Default / Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the FastAPI backend | `http://127.0.0.1:8000` |

> **Security Note:** Never commit `.env` files, database credentials, or secret keys to version control.

---

## API Endpoint Documentation

### Patient Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/patients` | List all patients. Supports optional query params: `search`, `ward`, `department`, `doctor`, `status`. |
| `GET` | `/api/patients/{id}` | Retrieve a single patient by ID (`404` if missing). |
| `POST` | `/api/patients` | Create a new patient admission (`201 Created`, `422` on validation failure). |
| `PUT` | `/api/patients/{id}` | Update all patient details (`200 OK`, `404` if missing, `422` on validation failure). |
| `PATCH` | `/api/patients/{id}/discharge` | Mark an admitted patient as `Discharged`. |
| `DELETE` | `/api/patients/{id}` | Permanently delete a patient record. |

### Dashboard & Metadata Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Returns `{ total_patients, admitted_patients, discharged_patients }`. |
| `GET` | `/api/options` | Returns centralized dropdown options (`genders`, `wards`, `departments`, `doctors`, `statuses`). |
| `GET` | `/api/health` | Service and database health check. |

### Validation Rules Enforced (Frontend + Backend)

- **Name**: Required, alphabetic letters and spaces only (`^[A-Za-z ]+$`), max 100 chars.
- **Age**: Required whole integer between `0` and `120`.
- **Gender / Ward / Department / Doctor**: Required and must match centralized allowed options.
- **Admission Date**: Required `YYYY-MM-DD` date, cannot be in the future.
- **Status**: Must be `Admitted` or `Discharged` (defaults to `Admitted` on creation).

---

## Database Information

- **Local Development**: Uses SQLite (`backend/patients.db`), automatically created on startup via SQLAlchemy `Base.metadata.create_all(bind=engine)`. Records remain persisted across backend restarts.
- **Production (PostgreSQL)**: Update `DATABASE_URL` in your environment to your PostgreSQL connection string. `database.py` automatically normalizes `postgres://` URLs to `postgresql+psycopg2://` and adjusts SQLAlchemy engine arguments.

---

## Deployment Instructions

### Backend + PostgreSQL on Render
1. Create a managed **PostgreSQL** database on Render and copy its **Internal/External Database URL**.
2. Create a new **Web Service** on Render pointing to the `backend/` root directory:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Set Environment Variables on Render:
   - `DATABASE_URL` = `<your-render-postgresql-url>`
   - `CORS_ORIGINS` = `https://your-vercel-app-url.vercel.app`
   - `APP_ENV` = `production`

### Frontend on Vercel
1. Import the repository into Vercel and set the **Root Directory** to `frontend`.
2. Framework Preset: **Vite** (`npm run build`, output directory `dist`).
3. Set Environment Variable:
   - `VITE_API_BASE_URL` = `https://your-render-api-url.onrender.com`
4. `frontend/vercel.json` is preconfigured to handle React Router client-side routes.

---

## Running Backend Tests

```bash
cd backend
.\.venv\Scripts\python.exe -m pytest -v
```

---

## Screenshots

- *Dashboard Overview (`/`)* — *(Add screenshot after deployment)*
- *All Patients & Combined Filters (`/patients`)* — *(Add screenshot after deployment)*
- *Add Patient Form (`/add-patient`)* — *(Add screenshot after deployment)*
=======
# -medcore-patient-management
>>>>>>> cc6a66cc0fc3fa4f547000ebbfa0148a99469af9
