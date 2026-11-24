import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardPlus } from 'lucide-react';
import PatientForm from '../components/PatientForm';
import { useToast } from '../context/ToastContext';
import { parseApiError } from '../services/api';
import { createPatient } from '../services/patientService';

export default function AddPatient() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [serverFieldErrors, setServerFieldErrors] = useState({});

  const handleCreate = async (payload) => {
    setIsSubmitting(true);
    setServerError('');
    setServerFieldErrors({});

    try {
      const created = await createPatient(payload);
      showToast({
        type: 'success',
        title: 'Patient Admitted',
        message: `${created.name} (#${created.id}) has been admitted to ${created.ward}.`,
      });
      navigate('/');
    } catch (error) {
      const parsed = parseApiError(error);
      setServerError(parsed.message);
      setServerFieldErrors(parsed.fieldErrors);
      showToast({
        type: 'error',
        title: 'Registration Failed',
        message: parsed.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Add New Patient
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Register a patient admission with ward, department, and attending doctor assignment.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <ClipboardPlus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Patient Admission Form
            </h2>
            <p className="text-xs text-slate-500">
              All fields marked with <span className="text-rose-500">*</span> are required.
            </p>
          </div>
        </div>

        <div className="p-6">
          <PatientForm
            mode="create"
            onSubmit={handleCreate}
            onCancel={() => navigate('/')}
            isSubmitting={isSubmitting}
            serverError={serverError}
            serverFieldErrors={serverFieldErrors}
          />
        </div>
      </div>
    </div>
  );
}
