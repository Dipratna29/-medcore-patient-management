import { Activity, UserCheck, Users } from 'lucide-react';

export default function DashboardCards({ stats, isLoading }) {
  const cards = [
    {
      title: 'Total Patients',
      value: stats?.total_patients ?? 0,
      subtitle: 'All registered admissions',
      icon: Users,
      accentBg: 'bg-blue-50',
      accentText: 'text-blue-600',
      borderAccent: 'border-blue-100',
    },
    {
      title: 'Currently Admitted',
      value: stats?.admitted_patients ?? 0,
      subtitle: 'Active inpatient care',
      icon: Activity,
      accentBg: 'bg-emerald-50',
      accentText: 'text-emerald-600',
      borderAccent: 'border-emerald-100',
    },
    {
      title: 'Discharged Patients',
      value: stats?.discharged_patients ?? 0,
      subtitle: 'Completed hospital stays',
      icon: UserCheck,
      accentBg: 'bg-slate-100',
      accentText: 'text-slate-600',
      borderAccent: 'border-slate-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                {isLoading ? (
                  <div className="mt-2 h-8 w-16 animate-pulse rounded-lg bg-slate-200" />
                ) : (
                  <p className="mt-1.5 text-3xl font-bold tracking-tight text-slate-900">
                    {card.value}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500">{card.subtitle}</p>
              </div>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${card.accentBg} ${card.accentText} ${card.borderAccent}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
