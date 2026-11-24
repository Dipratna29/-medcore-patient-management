import { Building2, Stethoscope, ShieldCheck, Layers } from 'lucide-react';
import {
  DEPARTMENT_OPTIONS,
  DOCTOR_OPTIONS,
  WARD_OPTIONS,
} from '../constants/patientOptions';

export default function Settings() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Hospital Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          System configuration overview and centralized hospital directory references.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-semibold">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h2>Active Wards ({WARD_OPTIONS.length})</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {WARD_OPTIONS.map((ward) => (
              <span
                key={ward}
                className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
              >
                {ward}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-semibold">
            <Layers className="h-5 w-5 text-blue-600" />
            <h2>Medical Departments ({DEPARTMENT_OPTIONS.length})</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {DEPARTMENT_OPTIONS.map((dept) => (
              <span
                key={dept}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                {dept}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-semibold">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            <h2>Attending Doctors ({DOCTOR_OPTIONS.length})</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {DOCTOR_OPTIONS.map((doc) => (
              <span
                key={doc}
                className="rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
              >
                {doc}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-semibold">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <h2>API & Environment</h2>
          </div>
          <dl className="space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Backend Endpoint</dt>
              <dd className="font-mono font-medium text-slate-800">{apiUrl}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Authentication Mode</dt>
              <dd className="font-medium text-slate-800">Open Admin Desk (No Login)</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-500">Validation Policy</dt>
              <dd className="font-medium text-emerald-700">Frontend + FastAPI Strict</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
