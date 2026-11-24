export default function StatusBadge({ status }) {
  const isAdmitted = status === 'Admitted';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${
        isAdmitted
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-slate-100 text-slate-600 border-slate-200'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isAdmitted ? 'bg-emerald-500' : 'bg-slate-400'
        }`}
      />
      {status}
    </span>
  );
}
