import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({
  label = 'Memuat data film...',
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-3 text-[16px] text-[var(--kertas)] py-4"
    >
      <Loader2
        size={20}
        aria-hidden="true"
        className="animate-spin text-[var(--lampu)]"
      />
      <span>{label}</span>
    </div>
  );
}

interface PosterSkeletonGridProps {
  count?: number;
}

export function PosterSkeletonGrid({ count = 10 }: PosterSkeletonGridProps) {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col">
          <div className="w-full aspect-[2/3] rounded-[6px] bg-[var(--tirai)]" />
          <div className="mt-2.5 h-4 w-4/5 rounded bg-[var(--tirai)]" />
          <div className="mt-1.5 h-3.5 w-1/3 rounded bg-[var(--tirai)]" />
        </div>
      ))}
    </div>
  );
}
