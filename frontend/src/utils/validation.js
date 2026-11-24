import {
  DEPARTMENT_OPTIONS,
  DOCTOR_OPTIONS,
  GENDER_OPTIONS,
  STATUS_OPTIONS,
  WARD_OPTIONS,
} from '../constants/patientOptions';

const NAME_REGEX = /^[A-Za-z ]+$/;

/**
 * Returns today's local date in YYYY-MM-DD format (avoids UTC off-by-one issues).
 */
export function getTodayLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Client-side validation mirroring all backend Pydantic rules.
 */
export function validatePatientForm(values) {
  const errors = {};
  const trimmedName = (values.name || '').trim().replace(/\s+/g, ' ');

  if (!trimmedName) {
    errors.name = 'Patient name is required.';
  } else if (trimmedName.length > 100) {
    errors.name = 'Patient name must not exceed 100 characters.';
  } else if (!NAME_REGEX.test(trimmedName)) {
    errors.name = 'Patient name must contain only alphabetic letters and spaces.';
  }

  const rawAge = values.age;
  if (rawAge === '' || rawAge === null || rawAge === undefined) {
    errors.age = 'Age is required.';
  } else {
    const numAge = Number(rawAge);
    if (!Number.isInteger(numAge) || Number.isNaN(numAge)) {
      errors.age = 'Age must be a valid whole number.';
    } else if (numAge < 0 || numAge > 120) {
      errors.age = 'Age must be between 0 and 120.';
    }
  }

  if (!values.gender) {
    errors.gender = 'Gender is required.';
  } else if (!GENDER_OPTIONS.includes(values.gender)) {
    errors.gender = 'Please select a valid gender option.';
  }

  if (!values.ward) {
    errors.ward = 'Ward is required.';
  } else if (!WARD_OPTIONS.includes(values.ward)) {
    errors.ward = 'Please select a valid ward option.';
  }

  if (!values.department) {
    errors.department = 'Department is required.';
  } else if (!DEPARTMENT_OPTIONS.includes(values.department)) {
    errors.department = 'Please select a valid department option.';
  }

  if (!values.doctor) {
    errors.doctor = 'Doctor is required.';
  } else if (!DOCTOR_OPTIONS.includes(values.doctor)) {
    errors.doctor = 'Please select a valid doctor option.';
  }

  if (!values.admission_date) {
    errors.admission_date = 'Admission date is required.';
  } else if (values.admission_date > getTodayLocalDateString()) {
    errors.admission_date = 'Admission date cannot be in the future.';
  }

  if (values.status && !STATUS_OPTIONS.includes(values.status)) {
    errors.status = 'Status must be Admitted or Discharged.';
  }

  return errors;
}
