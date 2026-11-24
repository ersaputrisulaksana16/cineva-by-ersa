import { SortOption } from '../types/movie';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'popular', label: 'Populer' },
  { value: 'rating', label: 'Rating tertinggi' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'title', label: 'Judul A-Z' },
];

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <label
        htmlFor="sort-select"
        className="text-[14px] font-medium text-[var(--kertas-redup)] whitespace-nowrap"
      >
        Urutkan
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(event) => onChange(event.target.value as SortOption)}
        className="h-10 px-3.5 rounded-[10px] bg-[var(--tirai)] text-[var(--kertas)] text-[14px] font-medium border border-[#5B417E] cursor-pointer"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
