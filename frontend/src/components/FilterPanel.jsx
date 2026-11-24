import { RotateCcw } from 'lucide-react';
import {
  DEPARTMENT_OPTIONS,
  DOCTOR_OPTIONS,
  WARD_OPTIONS,
} from '../constants/patientOptions';

export default function FilterPanel({
  ward,
  department,
  doctor,
  hasActiveFilters,
  onWardChange,
  onDepartmentChange,
  onDoctorChange,
  onClearFilters,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="min-w-[160px] flex-1 sm:flex-initial">
        <label htmlFor="filter-ward" className="sr-only">
          Filter by Ward
        </label>
        <select
          id="filter-ward"
          value={ward}
          onChange={(e) => onWardChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all"
        >
          <option value="">All Wards</option>
          {WARD_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[175px] flex-1 sm:flex-initial">
        <label htmlFor="filter-department" className="sr-only">
          Filter by Department
        </label>
        <select
          id="filter-department"
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all"
        >
          <option value="">All Departments</option>
          {DEPARTMENT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[160px] flex-1 sm:flex-initial">
        <label htmlFor="filter-doctor" className="sr-only">
          Filter by Doctor
        </label>
        <select
          id="filter-doctor"
          value={doctor}
          onChange={(e) => onDoctorChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all"
        >
          <option value="">All Doctors</option>
          {DOCTOR_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  );
}
