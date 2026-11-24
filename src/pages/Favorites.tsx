import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { MovieCard } from '../components/MovieCard';
import { useFavorites } from '../context/FavoritesContext';

export function Favorites() {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Favorit — Cineva';
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 pt-10 pb-16">
      <h1 className="font-display text-[28px] md:text-[44px] font-bold text-[var(--kertas)] leading-tight">
        Film favorit
      </h1>
      <p className="mt-3 text-[16px] text-[var(--kertas-redup)] max-w-[65ch]">
        Daftar film yang Anda simpan untuk ditonton atau diingat kembali.
      </p>

      <div className="mt-8">
        {favorites.length === 0 ? (
          <EmptyState
            message="Belum ada film favorit yang disimpan. Tekan tombol hati pada poster film untuk menyimpannya di sini."
            actionLabel="Jelajah film"
            onAction={() => navigate('/')}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                releaseDate={movie.release_date}
                voteAverage={movie.vote_average}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
