import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { PosterImage } from './PosterImage';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
}

export function MovieCard({
  id,
  title,
  posterPath,
  releaseDate,
  voteAverage,
}: MovieCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(id);
  const releaseYear = releaseDate ? releaseDate.slice(0, 4) : 'Tahun tidak tersedia';
  const formattedRating =
    voteAverage > 0 ? voteAverage.toFixed(1) : 'Baru';

  const handleToggleFavorite = () => {
    toggleFavorite({
      id,
      title,
      poster_path: posterPath,
      release_date: releaseDate,
      vote_average: voteAverage,
    });
  };

  return (
    <article className="flex flex-col items-start">
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-[6px] bg-[var(--tirai)]">
        <Link
          to={`/movies/${id}`}
          aria-label={`Lihat detail ${title}`}
          className="block w-full h-full"
        >
          <PosterImage posterPath={posterPath} title={title} />
        </Link>

        <span
          aria-label={`Rating ${formattedRating}`}
          className="absolute top-2 left-2 px-2 py-0.5 rounded-[4px] bg-[var(--lampu)] text-[#1E122E] text-[14px] font-semibold tabular-nums leading-tight pointer-events-none"
        >
          {formattedRating}
        </span>

        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-pressed={favorited}
          aria-label={
            favorited
              ? `Hapus ${title} dari favorit`
              : `Tambahkan ${title} ke favorit`
          }
          className="absolute top-2 right-2 w-9 h-9 rounded-[10px] bg-[#2A1B3D]/85 flex items-center justify-center transition-colors duration-150 hover:bg-[#2A1B3D]"
        >
          <Heart
            size={18}
            className={
              favorited
                ? 'text-[var(--karcis)] fill-[var(--karcis)]'
                : 'text-[var(--kertas)]'
            }
          />
        </button>
      </div>

      <Link
        to={`/movies/${id}`}
        className="mt-2.5 text-[16px] font-medium text-[var(--kertas)] leading-snug hover:text-[var(--lampu)] transition-colors duration-150 line-clamp-2"
      >
        {title}
      </Link>
      <p className="mt-0.5 text-[14px] text-[var(--kertas-redup)] tabular-nums">
        {releaseYear}
      </p>
    </article>
  );
}
