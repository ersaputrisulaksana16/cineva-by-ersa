import { Film, Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { MovieDetailData } from '../types/movie';
import { PosterImage } from './PosterImage';

interface TicketLayoutProps {
  movie: MovieDetailData;
  showTrailer: boolean;
  onToggleTrailer: () => void;
  hasTrailer: boolean;
}

export function TicketLayout({
  movie,
  showTrailer,
  onToggleTrailer,
  hasTrailer,
}: TicketLayoutProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(movie.id);

  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : 'Tahun tidak tersedia';
  const runtimeText =
    movie.runtime && movie.runtime > 0
      ? `${movie.runtime} menit`
      : 'Durasi tidak tersedia';
  const ratingText =
    movie.vote_average > 0 ? movie.vote_average.toFixed(1) : 'Belum ada rating';

  const handleFavoriteClick = () => {
    toggleFavorite({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    });
  };

  return (
    <section aria-label="Karcis informasi film" className="w-full">
      <div className="flex flex-col md:flex-row items-stretch">
        {/* Potongan kiri karcis: poster */}
        <div className="ticket-stub-top bg-[var(--tirai)] p-6 md:p-7 md:w-[290px] lg:w-[320px] shrink-0 rounded-t-[10px] md:rounded-t-none md:rounded-l-[10px] border-b-2 md:border-b-0 md:border-r-2 border-dashed border-[var(--layar)] flex flex-col justify-between">
          <div className="w-full max-w-[240px] md:max-w-none mx-auto aspect-[2/3] rounded-[6px] overflow-hidden bg-[var(--layar)]">
            <PosterImage posterPath={movie.poster_path} title={movie.title} />
          </div>

          <div className="mt-4 pt-3 border-t border-[#4E3670] flex items-center justify-between text-[14px] text-[var(--kertas-redup)] tabular-nums">
            <span>Kode karcis</span>
            <span className="font-semibold text-[var(--kertas)]">
              CNV-{movie.id}
            </span>
          </div>
        </div>

        {/* Badan utama karcis: detail film */}
        <div className="ticket-body-bottom bg-[var(--tirai)] p-6 md:p-8 flex-1 rounded-b-[10px] md:rounded-b-none md:rounded-r-[10px] flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-[4px] bg-[var(--lampu)] text-[#1E122E] text-[14px] font-semibold tabular-nums">
                Rating {ratingText}
              </span>
              <span className="text-[14px] text-[var(--kertas-redup)] tabular-nums">
                Rilis {releaseYear}
              </span>
              <span className="text-[14px] text-[var(--kertas-redup)] tabular-nums">
                {runtimeText}
              </span>
            </div>

            <h1 className="mt-4 font-display text-[28px] md:text-[44px] font-bold text-[var(--kertas)] leading-tight text-balance">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="mt-2 text-[16px] italic text-[var(--kertas-redup)] max-w-[65ch]">
                {movie.tagline}
              </p>
            )}

            {movie.genres.length > 0 && (
              <p className="mt-4 text-[14px] text-[var(--kertas-redup)]">
                Genre:{' '}
                <span className="text-[var(--kertas)]">
                  {movie.genres.map((genre) => genre.name).join(', ')}
                </span>
              </p>
            )}

            <p className="mt-6 text-[16px] text-[var(--kertas)] leading-relaxed max-w-[65ch]">
              {movie.overview
                ? movie.overview
                : 'Sinopsis dalam bahasa Indonesia belum tersedia untuk film ini.'}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#4E3670] flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleFavoriteClick}
              aria-pressed={favorited}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[14px] font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 ${
                favorited
                  ? 'bg-[var(--karcis)] text-[#1E122E]'
                  : 'bg-[var(--layar)] text-[var(--kertas)] border border-[#5B417E] hover:border-[var(--karcis)]'
              }`}
            >
              <Heart
                size={16}
                aria-hidden="true"
                className={favorited ? 'fill-[#1E122E]' : 'text-[var(--karcis)]'}
              />
              <span>
                {favorited ? 'Tersimpan di favorit' : 'Simpan ke favorit'}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleTrailer}
              aria-expanded={showTrailer}
              disabled={!hasTrailer}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[var(--lampu)] text-[#1E122E] text-[14px] font-semibold whitespace-nowrap shrink-0 disabled:opacity-45 disabled:cursor-not-allowed hover:opacity-90 transition-opacity duration-150"
            >
              <Film size={16} aria-hidden="true" />
              <span>
                {!hasTrailer
                  ? 'Cuplikan tidak tersedia'
                  : showTrailer
                  ? 'Tutup cuplikan'
                  : 'Putar cuplikan'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
