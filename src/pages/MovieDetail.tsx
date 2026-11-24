import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useParams } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { TicketLayout } from '../components/TicketLayout';
import { useNotes } from '../context/NotesContext';
import { useMovieDetail } from '../hooks/useMovieDetail';
import { getBackdropUrl } from '../services/config';
import { MovieDetailData } from '../types/movie';

export interface MovieDetailOutletContext {
  movie: MovieDetailData;
}

export function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: movie, loading, error, refetch } = useMovieDetail(id);
  const { getNotesByMovieId } = useNotes();
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    setShowTrailer(false);
  }, [id]);

  useEffect(() => {
    if (movie?.title) {
      document.title = `${movie.title} — Cineva`;
    } else {
      document.title = 'Detail Film — Cineva';
    }
  }, [movie?.title]);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 py-12">
        <LoadingSpinner label="Memuat karcis film..." />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 py-12">
        <ErrorMessage
          message={
            error ??
            'Data detail film gagal dimuat. Periksa koneksi internet, lalu coba lagi.'
          }
          onRetry={refetch}
        />
        <div className="mt-6">
          <Link
            to="/"
            className="inline-block px-5 py-2.5 rounded-[10px] bg-[var(--tirai)] text-[var(--kertas)] text-[14px] font-semibold hover:bg-[#493268] transition-colors duration-150"
          >
            Kembali ke jelajah
          </Link>
        </div>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const movieNotesCount = getNotesByMovieId(movie.id).length;
  const trailerVideo =
    movie.videos?.results.find(
      (video) => video.site === 'YouTube' && video.type === 'Trailer'
    ) ??
    movie.videos?.results.find((video) => video.site === 'YouTube') ??
    null;

  const tabClassName = ({ isActive }: { isActive: boolean }) =>
    `px-5 py-2.5 rounded-[10px] text-[16px] font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 ${
      isActive
        ? 'bg-[var(--lampu)] text-[#1E122E]'
        : 'bg-[var(--tirai)] text-[var(--kertas)] hover:bg-[#493268]'
    }`;

  return (
    <div className="relative overflow-hidden">
      {/* Latar blur film di belakang karcis */}
      {backdropUrl && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[560px] overflow-hidden pointer-events-none"
        >
          <img
            src={backdropUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover blur-md scale-105 opacity-35"
          />
          <div className="absolute inset-0 bg-[#2A1B3D]/70" />
        </div>
      )}

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 pt-8 pb-16">
        <div className="mb-6">
          <Link
            to="/"
            className="text-[14px] font-medium text-[var(--kertas-redup)] hover:text-[var(--lampu)] underline underline-offset-4"
          >
            Kembali ke daftar film
          </Link>
        </div>

        <TicketLayout
          movie={movie}
          showTrailer={showTrailer}
          onToggleTrailer={() => setShowTrailer((prev) => !prev)}
          hasTrailer={Boolean(trailerVideo)}
        />

        {showTrailer && trailerVideo && (
          <section
            aria-label="Cuplikan film"
            className="mt-8 bg-[var(--tirai)] rounded-[10px] p-4 md:p-6"
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="font-display text-[20px] font-bold text-[var(--kertas)]">
                Cuplikan resmi
              </h2>
              <button
                type="button"
                onClick={() => setShowTrailer(false)}
                className="px-4 py-2 rounded-[10px] bg-[var(--layar)] text-[var(--kertas)] text-[14px] font-medium hover:text-[var(--lampu)]"
              >
                Tutup cuplikan
              </button>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded-[6px] bg-[var(--layar)]">
              <iframe
                title={`Cuplikan ${movie.title}`}
                src={`https://www.youtube-nocookie.com/embed/${trailerVideo.key}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </section>
        )}

        {/* Tab di bawah karcis */}
        <nav
          aria-label="Tab informasi film"
          className="mt-10 flex flex-wrap items-center gap-3 border-b border-[var(--tirai)] pb-4"
        >
          <NavLink to="" end className={tabClassName}>
            Ringkasan
          </NavLink>
          <NavLink to="notes" className={tabClassName}>
            Catatan ({movieNotesCount})
          </NavLink>
        </nav>

        <div className="mt-8">
          <Outlet context={{ movie } satisfies MovieDetailOutletContext} />
        </div>
      </div>
    </div>
  );
}
