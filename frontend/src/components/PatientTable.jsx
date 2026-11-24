import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Pencil,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import StatusBadge from './StatusBadge';

const PAGE_SIZE = 8;

export default function PatientTable({
  patients,
  isLoading,
  hasActiveFilters,
  onClearFilters,
  onEdit,
  onDelete,
  onDischarge,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil((patients?.length || 0) / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [patients?.length, hasActiveFilters]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <LoadingSpinner size="lg" label="Loading patient records..." />
      </div>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
          <Users className="h-7 w-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">
          {hasActiveFilters ? 'No matching patients found' : 'No patient records yet'}
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-slate-500">
          {hasActiveFilters
            ? 'Try adjusting your search query or clearing active ward, department, and doctor filters.'
            : 'Start by admitting a new patient to track ward assignments, doctors, and statuses.'}
        </p>
        <div className="mt-5 flex items-center gap-3">
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Clear All Filters
            </button>
          ) : (
            <Link
              to="/add-patient"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add First Patient</span>
            </Link>
          )}
        </div>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedPatients = patients.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 pl-5 pr-3">ID</th>
              <th className="py-3.5 px-3">Patient Name</th>
              <th className="py-3.5 px-3">Age</th>
              <th className="py-3.5 px-3">Gender</th>
              <th className="py-3.5 px-3">Ward</th>
              <th className="py-3.5 px-3">Department</th>
              <th className="py-3.5 px-3">Doctor</th>
              <th className="py-3.5 px-3">Admission Date</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {paginatedPatients.map((patient) => {
              const isAdmitted = patient.status === 'Admitted';
              return (
                <tr
                  key={patient.id}
                  className="hover:bg-blue-50/35 transition-colors"
                >
                  <td className="py-3.5 pl-5 pr-3 font-mono text-xs font-semibold text-slate-500 whitespace-nowrap">
                    #{patient.id}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                    {patient.name}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                    {patient.age} yrs
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                    {patient.gender}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-lg bg-blue-50/80 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {patient.ward}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 whitespace-nowrap">
                    {patient.department}
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 whitespace-nowrap">
                    {patient.doctor}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                    {patient.admission_date}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <StatusBadge status={patient.status} />
                  </td>
                  <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(patient)}
                        title="Edit patient"
                        aria-label={`Edit ${patient.name}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="hidden xl:inline">Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDischarge(patient)}
                        disabled={!isAdmitted}
                        title={
                          isAdmitted
                            ? 'Mark patient as Discharged'
                            : 'Patient already discharged'
                        }
                        aria-label={`Discharge ${patient.name}`}
                        className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                          isAdmitted
                            ? 'border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100'
                            : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span className="hidden xl:inline">Discharge</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(patient)}
                        title="Delete patient"
                        aria-label={`Delete ${patient.name}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50/60 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden xl:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 px-5 py-3.5 text-xs text-slate-500">
        <p>
          Showing{' '}
          <span className="font-semibold text-slate-700">{startIndex + 1}</span>–
          <span className="font-semibold text-slate-700">
            {Math.min(startIndex + PAGE_SIZE, patients.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-700">{patients.length}</span>{' '}
          patients
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </button>
            <span className="px-2 font-medium text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
