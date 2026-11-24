import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, X } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import FilterPanel from '../components/FilterPanel';
import PatientForm from '../components/PatientForm';
import PatientTable from '../components/PatientTable';
import SearchBar from '../components/SearchBar';
import { useToast } from '../context/ToastContext';
import { parseApiError } from '../services/api';
import {
  deletePatient,
  dischargePatient,
  getPatients,
  updatePatient,
} from '../services/patientService';

export default function Patients() {
  const { showToast } = useToast();

  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [ward, setWard] = useState('');
  const [department, setDepartment] = useState('');
  const [doctor, setDoctor] = useState('');

  const [editingPatient, setEditingPatient] = useState(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editServerError, setEditServerError] = useState('');
  const [editFieldErrors, setEditFieldErrors] = useState({});

  const [confirmAction, setConfirmAction] = useState(null);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const hasActiveFilters = Boolean(search.trim() || ward || department || doctor);

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getPatients({ search, ward, department, doctor });
      setPatients(data);
    } catch (error) {
      const parsed = parseApiError(error);
      showToast({
        type: 'error',
        title: 'Failed to Load Patients',
        message: parsed.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, ward, department, doctor, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients();
    }, 180);
    return () => clearTimeout(timer);
  }, [fetchPatients]);

  const handleClearFilters = () => {
    setSearch('');
    setWard('');
    setDepartment('');
    setDoctor('');
  };

  const handleEditSubmit = async (payload) => {
    if (!editingPatient) return;
    setIsEditSubmitting(true);
    setEditServerError('');
    setEditFieldErrors({});

    try {
      const updated = await updatePatient(editingPatient.id, payload);
      setEditingPatient(null);
      showToast({
        type: 'success',
        title: 'Patient Updated',
        message: `${updated.name}'s details were saved.`,
      });
      await fetchPatients();
    } catch (error) {
      const parsed = parseApiError(error);
      setEditServerError(parsed.message);
      setEditFieldErrors(parsed.fieldErrors);
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: parsed.message,
      });
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    const { type, patient } = confirmAction;
    setIsConfirmLoading(true);

    try {
      if (type === 'delete') {
        await deletePatient(patient.id);
        showToast({
          type: 'success',
          title: 'Patient Deleted',
          message: `${patient.name} (#${patient.id}) was permanently removed.`,
        });
      } else if (type === 'discharge') {
        await dischargePatient(patient.id);
        showToast({
          type: 'success',
          title: 'Patient Discharged',
          message: `${patient.name} is now marked as Discharged.`,
        });
      }
      setConfirmAction(null);
      await fetchPatients();
    } catch (error) {
      const parsed = parseApiError(error);
      showToast({
        type: 'error',
        title: type === 'delete' ? 'Delete Failed' : 'Discharge Failed',
        message: parsed.message,
      });
    } finally {
      setIsConfirmLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            All Patients
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse, search, filter, update, discharge, or remove registered patient records.
          </p>
        </div>

        <Link
          to="/add-patient"
          className="inline-flex items-center justify-center gap-2 self-start sm:self-auto rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Patient</span>
        </Link>
      </div>

      <section className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 p-5 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <FilterPanel
            ward={ward}
            department={department}
            doctor={doctor}
            hasActiveFilters={hasActiveFilters}
            onWardChange={setWard}
            onDepartmentChange={setDepartment}
            onDoctorChange={setDoctor}
            onClearFilters={handleClearFilters}
          />
        </div>

        <PatientTable
          patients={patients}
          isLoading={isLoading}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onEdit={(patient) => {
            setEditServerError('');
            setEditFieldErrors({});
            setEditingPatient(patient);
          }}
          onDelete={(patient) => setConfirmAction({ type: 'delete', patient })}
          onDischarge={(patient) => setConfirmAction({ type: 'discharge', patient })}
        />
      </section>

      {editingPatient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="patients-edit-modal-title"
        >
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3
                  id="patients-edit-modal-title"
                  className="text-lg font-semibold text-slate-900"
                >
                  Edit Patient #{editingPatient.id}
                </h3>
                <p className="text-xs text-slate-500">
                  Modify details for {editingPatient.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => !isEditSubmitting && setEditingPatient(null)}
                disabled={isEditSubmitting}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                aria-label="Close edit modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <PatientForm
                mode="edit"
                initialData={editingPatient}
                onSubmit={handleEditSubmit}
                onCancel={() => !isEditSubmitting && setEditingPatient(null)}
                isSubmitting={isEditSubmitting}
                serverError={editServerError}
                serverFieldErrors={editFieldErrors}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(confirmAction)}
        variant={confirmAction?.type === 'delete' ? 'danger' : 'success'}
        title={
          confirmAction?.type === 'delete'
            ? 'Delete Patient Record'
            : 'Discharge Patient'
        }
        message={
          confirmAction?.type === 'delete'
            ? `Are you sure you want to permanently delete ${confirmAction?.patient?.name} (#${confirmAction?.patient?.id})? This action cannot be undone.`
            : `Confirm discharging ${confirmAction?.patient?.name} (#${confirmAction?.patient?.id}) from ${confirmAction?.patient?.ward}?`
        }
        confirmLabel={
          confirmAction?.type === 'delete' ? 'Delete Permanently' : 'Confirm Discharge'
        }
        isLoading={isConfirmLoading}
        onConfirm={handleConfirmAction}
        onCancel={() => !isConfirmLoading && setConfirmAction(null)}
      />
    </div>
  );
}
