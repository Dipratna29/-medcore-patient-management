import { useEffect, useState } from 'react';
import { AlertCircle, Save, X } from 'lucide-react';
import {
  DEPARTMENT_OPTIONS,
  DOCTOR_OPTIONS,
  GENDER_OPTIONS,
  STATUS_OPTIONS,
  WARD_OPTIONS,
} from '../constants/patientOptions';
import {
  getTodayLocalDateString,
  validatePatientForm,
} from '../utils/validation';
import LoadingSpinner from './LoadingSpinner';

const buildInitialValues = (initialData) => ({
  name: initialData?.name ?? '',
  age: initialData?.age !== undefined && initialData?.age !== null ? String(initialData.age) : '',
  gender: initialData?.gender ?? '',
  ward: initialData?.ward ?? '',
  department: initialData?.department ?? '',
  doctor: initialData?.doctor ?? '',
  admission_date: initialData?.admission_date ?? getTodayLocalDateString(),
  status: initialData?.status ?? 'Admitted',
});

export default function PatientForm({
  mode = 'create',
  initialData = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
  serverError = '',
  serverFieldErrors = {},
}) {
  const [values, setValues] = useState(() => buildInitialValues(initialData));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(buildInitialValues(initialData));
    setErrors({});
  }, [initialData]);

  useEffect(() => {
    if (serverFieldErrors && Object.keys(serverFieldErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...serverFieldErrors }));
    }
  }, [serverFieldErrors]);

  const handleChange = (field) => (event) => {
    const nextValue = event.target.value;
    setValues((prev) => ({ ...prev, [field]: nextValue }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validatePatientForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: values.name.trim().replace(/\s+/g, ' '),
      age: Number(values.age),
      gender: values.gender,
      ward: values.ward,
      department: values.department,
      doctor: values.doctor,
      admission_date: values.admission_date,
      status: mode === 'create' ? 'Admitted' : values.status,
    };

    await onSubmit(payload);
  };

  const today = getTodayLocalDateString();

  const inputClass = (hasError) =>
    `w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 transition-all focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-500/15'
        : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-500/15'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Patient Name */}
        <div className="sm:col-span-2">
          <label
            htmlFor="patient-name"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="patient-name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange('name')}
            placeholder="e.g., Aarav Sharma"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'patient-name-error' : undefined}
            className={inputClass(Boolean(errors.name))}
          />
          {errors.name && (
            <p id="patient-name-error" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.name}
            </p>
          )}
        </div>

        {/* Age */}
        <div>
          <label
            htmlFor="patient-age"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Age (Years) <span className="text-rose-500">*</span>
          </label>
          <input
            id="patient-age"
            name="age"
            type="number"
            min={0}
            max={120}
            step={1}
            value={values.age}
            onChange={handleChange('age')}
            placeholder="0 - 120"
            aria-invalid={Boolean(errors.age)}
            aria-describedby={errors.age ? 'patient-age-error' : undefined}
            className={inputClass(Boolean(errors.age))}
          />
          {errors.age && (
            <p id="patient-age-error" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.age}
            </p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label
            htmlFor="patient-gender"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Gender <span className="text-rose-500">*</span>
          </label>
          <select
            id="patient-gender"
            name="gender"
            value={values.gender}
            onChange={handleChange('gender')}
            aria-invalid={Boolean(errors.gender)}
            aria-describedby={errors.gender ? 'patient-gender-error' : undefined}
            className={inputClass(Boolean(errors.gender))}
          >
            <option value="">Select gender</option>
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.gender && (
            <p id="patient-gender-error" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.gender}
            </p>
          )}
        </div>

        {/* Ward */}
        <div>
          <label
            htmlFor="patient-ward"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Ward <span className="text-rose-500">*</span>
          </label>
          <select
            id="patient-ward"
            name="ward"
            value={values.ward}
            onChange={handleChange('ward')}
            aria-invalid={Boolean(errors.ward)}
            aria-describedby={errors.ward ? 'patient-ward-error' : undefined}
            className={inputClass(Boolean(errors.ward))}
          >
            <option value="">Select ward</option>
            {WARD_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.ward && (
            <p id="patient-ward-error" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.ward}
            </p>
          )}
        </div>

        {/* Department */}
        <div>
          <label
            htmlFor="patient-department"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Department <span className="text-rose-500">*</span>
          </label>
          <select
            id="patient-department"
            name="department"
            value={values.department}
            onChange={handleChange('department')}
            aria-invalid={Boolean(errors.department)}
            aria-describedby={errors.department ? 'patient-department-error' : undefined}
            className={inputClass(Boolean(errors.department))}
          >
            <option value="">Select department</option>
            {DEPARTMENT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.department && (
            <p id="patient-department-error" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.department}
            </p>
          )}
        </div>

        {/* Doctor */}
        <div>
          <label
            htmlFor="patient-doctor"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Attending Doctor <span className="text-rose-500">*</span>
          </label>
          <select
            id="patient-doctor"
            name="doctor"
            value={values.doctor}
            onChange={handleChange('doctor')}
            aria-invalid={Boolean(errors.doctor)}
            aria-describedby={errors.doctor ? 'patient-doctor-error' : undefined}
            className={inputClass(Boolean(errors.doctor))}
          >
            <option value="">Select doctor</option>
            {DOCTOR_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.doctor && (
            <p id="patient-doctor-error" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.doctor}
            </p>
          )}
        </div>

        {/* Admission Date */}
        <div>
          <label
            htmlFor="patient-admission-date"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Admission Date <span className="text-rose-500">*</span>
          </label>
          <input
            id="patient-admission-date"
            name="admission_date"
            type="date"
            max={today}
            value={values.admission_date}
            onChange={handleChange('admission_date')}
            aria-invalid={Boolean(errors.admission_date)}
            aria-describedby={
              errors.admission_date ? 'patient-admission-date-error' : undefined
            }
            className={inputClass(Boolean(errors.admission_date))}
          />
          {errors.admission_date && (
            <p
              id="patient-admission-date-error"
              className="mt-1.5 text-xs font-medium text-rose-600"
            >
              {errors.admission_date}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="sm:col-span-2">
          <label
            htmlFor="patient-status"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Admission Status
          </label>
          {mode === 'create' ? (
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <span className="text-sm font-medium text-slate-700">Admitted</span>
              <span className="text-xs text-slate-500">
                New registrations default to Admitted
              </span>
            </div>
          ) : (
            <select
              id="patient-status"
              name="status"
              value={values.status}
              onChange={handleChange('status')}
              aria-invalid={Boolean(errors.status)}
              className={inputClass(Boolean(errors.status))}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}
          {errors.status && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.status}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {isSubmitting ? (
            <LoadingSpinner
              size="sm"
              label={mode === 'create' ? 'Admitting Patient...' : 'Saving Changes...'}
              className="text-white [&>svg]:text-white"
            />
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{mode === 'create' ? 'Admit Patient' : 'Save Changes'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
