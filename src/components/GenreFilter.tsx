import { Genre } from '../types/movie';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: string;
  onSelectGenre: (genreId: string) => void;
  loading?: boolean;
}

export function GenreFilter({
  genres,
  selectedGenre,
  onSelectGenre,
  loading = false,
}: GenreFilterProps) {
  if (loading && genres.length === 0) {
    return (
      <div
        aria-label="Memuat filter genre"
        className="flex flex-wrap gap-2"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-9 w-24 rounded-full bg-[var(--tirai)]"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Filter berdasarkan genre"
      className="flex flex-wrap items-center gap-2"
    >
      <button
        type="button"
        onClick={() => onSelectGenre('')}
        aria-pressed={selectedGenre === ''}
        className={`px-4 py-1.5 rounded-full text-[14px] font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
          selectedGenre === ''
            ? 'bg-[var(--lampu)] text-[#1E122E] font-semibold'
            : 'bg-[var(--tirai)] text-[var(--kertas)] hover:bg-[#493268]'
        }`}
      >
        Semua genre
      </button>

      {genres.map((genre) => {
        const isActive = selectedGenre === String(genre.id);
        return (
          <button
            key={genre.id}
            type="button"
            onClick={() => onSelectGenre(isActive ? '' : String(genre.id))}
            aria-pressed={isActive}
            className={`px-4 py-1.5 rounded-full text-[14px] font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
              isActive
                ? 'bg-[var(--lampu)] text-[#1E122E] font-semibold'
                : 'bg-[var(--tirai)] text-[var(--kertas)] hover:bg-[#493268]'
            }`}
          >
            {genre.name}
          </button>
        );
      })}
    </div>
  );
}
