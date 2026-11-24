/**
 * Centralized dropdown options for Patient Admission Management.
 * Keep in sync with backend/app/constants.py or update dynamically via /api/options.
 */

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export const WARD_OPTIONS = [
  'General Ward',
  'ICU',
  'Emergency Ward',
  'Private Ward',
  'Pediatric Ward',
  'Maternity Ward',
];

export const DEPARTMENT_OPTIONS = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'General Medicine',
  'Dermatology',
  'Oncology',
  'Gynecology',
];

export const DOCTOR_OPTIONS = [
  'Dr. Sharma',
  'Dr. Patel',
  'Dr. Mehta',
  'Dr. Gupta',
  'Dr. Singh',
  'Dr. Kumar',
];

export const STATUS_OPTIONS = ['Admitted', 'Discharged'];
