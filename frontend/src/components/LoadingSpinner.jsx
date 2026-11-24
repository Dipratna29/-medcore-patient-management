import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label = 'Loading...', size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-9 w-9',
  };

  return (
    <div className={`flex items-center justify-center gap-2.5 text-slate-600 ${className}`}>
      <Loader2 className={`animate-spin text-blue-600 ${sizes[size] || sizes.md}`} />
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
}
