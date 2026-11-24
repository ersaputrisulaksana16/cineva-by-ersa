import { Clock, Search, X } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SearchBarProps {
  value: string;
  onChange: (nextValue: string) => void;
  onSubmitSearch: (query: string) => void;
  committedQuery?: string;
}

const MAX_HISTORY_ITEMS = 6;

export function SearchBar({
  value,
  onChange,
  onSubmitSearch,
  committedQuery = '',
}: SearchBarProps) {
  const [history, setHistory] = useLocalStorage<string[]>(
    'cineva:search-history',
    []
  );

  const saveHistoryTerm = (rawTerm: string) => {
    const trimmed = rawTerm.trim();
    if (trimmed.length < 2) return;
    setHistory((prev) => {
      const filtered = prev.filter(
        (item) => item.toLowerCase() !== trimmed.toLowerCase()
      );
      return [trimmed, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    });
  };

  useEffect(() => {
    if (committedQuery.trim().length >= 2) {
      saveHistoryTerm(committedQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committedQuery]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      saveHistoryTerm(trimmed);
    }
    onSubmitSearch(trimmed);
  };

  const handleClear = () => {
    onChange('');
    onSubmitSearch('');
  };

  const handleHistoryClick = (term: string) => {
    onChange(term);
    saveHistoryTerm(term);
    onSubmitSearch(term);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="w-full max-w-2xl">
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Pencarian film"
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
      >
        <div className="relative flex-1">
          <Search
            size={18}
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--kertas-redup)] pointer-events-none"
          />
          <label htmlFor="movie-search-input" className="sr-only">
            Cari judul film
          </label>
          <input
            id="movie-search-input"
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Cari judul film..."
            autoComplete="off"
            className="w-full h-12 pl-11 pr-11 rounded-[10px] bg-[var(--layar)]/90 border border-[#5B417E] text-[16px] text-[var(--kertas)] placeholder:text-[var(--kertas-redup)]"
          />
          {value.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Hapus kata kunci"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-[8px] flex items-center justify-center text-[var(--kertas-redup)] hover:text-[var(--kertas)]"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="h-12 px-6 rounded-[10px] bg-[var(--lampu)] text-[#1E122E] text-[16px] font-semibold whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity duration-150"
        >
          Cari
        </button>
      </form>

      {history.length > 0 && (
        <div
          aria-label="Riwayat pencarian"
          className="mt-3 flex flex-wrap items-center gap-2"
        >
          <span className="inline-flex items-center gap-1.5 text-[14px] text-[var(--kertas-redup)] mr-1">
            <Clock size={14} aria-hidden="true" />
            <span>Terakhir dicari</span>
          </span>
          {history.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleHistoryClick(term)}
              className="px-3 py-1 rounded-full bg-[var(--layar)]/85 border border-[#5B417E] text-[14px] text-[var(--kertas)] hover:border-[var(--lampu)] hover:text-[var(--lampu)] transition-colors duration-150 whitespace-nowrap"
            >
              {term}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClearHistory}
            className="text-[14px] text-[var(--kertas-redup)] hover:text-[var(--karcis)] underline underline-offset-4 ml-1 whitespace-nowrap"
          >
            Hapus riwayat
          </button>
        </div>
      )}
    </div>
  );
}
