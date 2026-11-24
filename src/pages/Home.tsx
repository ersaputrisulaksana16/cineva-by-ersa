import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { GenreFilter } from '../components/GenreFilter';
import {
  LoadingSpinner,
  PosterSkeletonGrid,
} from '../components/LoadingSpinner';
import { MovieCard } from '../components/MovieCard';
import { Pagination } from '../components/Pagination';
import { SearchBar } from '../components/SearchBar';
import { SortSelect } from '../components/SortSelect';
import { useDebounce } from '../hooks/useDebounce';
import { useGenres } from '../hooks/useGenres';
import { useMovies, useSpotlightMovie } from '../hooks/useMovies';
import { getBackdropUrl, isTmdbConfigured } from '../services/config';
import { SortOption } from '../types/movie';

const VALID_SORTS: SortOption[] = ['popular', 'rating', 'newest', 'title'];

function parseSortParam(raw: string | null): SortOption {
  if (raw && VALID_SORTS.includes(raw as SortOption)) {
    return raw as SortOption;
  }
  return 'popular';
}

function parsePageParam(raw: string | null): number {
  const num = Number(raw);
  if (!Number.isInteger(num) || num < 1) return 1;
  return Math.min(500, num);
}

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery = searchParams.get('q') ?? '';
  const urlGenre = searchParams.get('genre') ?? '';
  const urlSort = parseSortParam(searchParams.get('sort'));
  const urlPage = parsePageParam(searchParams.get('page'));

  const [searchInput, setSearchInput] = useState(urlQuery);
  const debouncedInput = useDebounce(searchInput, 500);
  const lastUrlQueryRef = useRef(urlQuery);

  useEffect(() => {
    document.title = 'Cineva — Jelajah Film';
  }, []);

  // Sinkronkan input jika parameter URL berubah dari luar (mis. tombol kembali atau hapus filter)
  useEffect(() => {
    if (urlQuery !== lastUrlQueryRef.current) {
      lastUrlQueryRef.current = urlQuery;
      setSearchInput(urlQuery);
    }
  }, [urlQuery]);

  // Perbarui URL saat kata kunci hasil debounce berubah
  useEffect(() => {
    const trimmed = debouncedInput.trim();
    if (trimmed === lastUrlQueryRef.current) return;

    lastUrlQueryRef.current = trimmed;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (trimmed) {
        next.set('q', trimmed);
      } else {
        next.delete('q');
      }
      next.delete('page');
      return next;
    });
  }, [debouncedInput, setSearchParams]);

  const { data: spotlightMovie } = useSpotlightMovie();
  const {
    data: genres,
    loading: genresLoading,
  } = useGenres();
  const {
    data: moviesData,
    loading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies,
  } = useMovies({
    query: urlQuery,
    genre: urlGenre,
    sort: urlSort,
    page: urlPage,
  });

  const handleSubmitSearch = (submittedQuery: string) => {
    const trimmed = submittedQuery.trim();
    lastUrlQueryRef.current = trimmed;
    setSearchInput(trimmed);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (trimmed) {
        next.set('q', trimmed);
      } else {
        next.delete('q');
      }
      next.delete('page');
      return next;
    });
  };

  const handleSelectGenre = (nextGenre: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextGenre) {
        next.set('genre', nextGenre);
      } else {
        next.delete('genre');
      }
      next.delete('page');
      return next;
    });
  };

  const handleChangeSort = (nextSort: SortOption) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextSort === 'popular') {
        next.delete('sort');
      } else {
        next.set('sort', nextSort);
      }
      next.delete('page');
      return next;
    });
  };

  const handlePageChange = (nextPage: number) => {
    const clamped = Math.max(1, Math.min(500, nextPage));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (clamped <= 1) {
        next.delete('page');
      } else {
        next.set('page', String(clamped));
      }
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    lastUrlQueryRef.current = '';
    setSearchInput('');
    setSearchParams({});
  };

  const spotlightBackdrop = getBackdropUrl(spotlightMovie?.backdrop_path);
  const movies = moviesData?.results ?? [];
  const totalPages = moviesData?.total_pages ?? 1;
  const apiKeyReady = isTmdbConfigured();

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 pt-8 pb-12">
      {/* Sorotan utama dengan latar film terpopuler dan kolom pencarian */}
      <section
        aria-label="Sorotan film malam ini"
        className="relative overflow-hidden rounded-[10px] bg-[var(--tirai)] min-h-[340px] md:min-h-[400px] flex items-end spotlight-reveal"
      >
        {spotlightBackdrop && (
          <img
            src={spotlightBackdrop}
            alt={spotlightMovie ? `Latar film ${spotlightMovie.title}` : ''}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#2A1B3D]/78"
        />

        <div className="relative z-10 w-full p-6 md:p-10 lg:p-12">
          <h1 className="font-display text-[28px] md:text-[44px] font-bold text-[var(--kertas)] leading-tight max-w-2xl text-balance">
            Mau nonton apa malam ini?
          </h1>

          {spotlightMovie && (
            <p className="mt-3 text-[16px] text-[var(--kertas-redup)] max-w-[65ch]">
              Film terpopuler saat ini:{' '}
              <Link
                to={`/movies/${spotlightMovie.id}`}
                className="font-display text-[16px] md:text-[20px] font-bold text-[var(--lampu)] hover:underline underline-offset-4"
              >
                {spotlightMovie.title}
              </Link>
            </p>
          )}

          <div className="mt-6">
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              onSubmitSearch={handleSubmitSearch}
              committedQuery={urlQuery}
            />
          </div>
        </div>
      </section>

      {/* Pengaturan filter genre dan pengurutan */}
      <section aria-label="Filter dan urutan film" className="mt-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1 min-w-0">
            <GenreFilter
              genres={genres}
              selectedGenre={urlGenre}
              onSelectGenre={handleSelectGenre}
              loading={genresLoading}
            />
          </div>
          <SortSelect value={urlSort} onChange={handleChangeSort} />
        </div>
      </section>

      {/* Daftar film */}
      <section aria-label="Daftar film" className="mt-8">
        {!apiKeyReady ? (
          <ErrorMessage message="Kunci API TMDB belum diatur. Tambahkan VITE_TMDB_API_KEY pada file .env di akar proyek, lalu muat ulang halaman." />
        ) : moviesError ? (
          <ErrorMessage message={moviesError} onRetry={refetchMovies} />
        ) : moviesLoading ? (
          <div>
            <LoadingSpinner label="Memuat daftar film..." />
            <PosterSkeletonGrid count={10} />
          </div>
        ) : movies.length === 0 ? (
          <EmptyState
            message={
              urlQuery
                ? `Tidak ada film untuk '${urlQuery}'. Ubah kata kunci atau hapus filter.`
                : 'Tidak ada film yang cocok dengan filter ini. Hapus filter untuk melihat semua film.'
            }
            actionLabel="Hapus filter"
            onAction={handleResetFilters}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10">
              {movies.map((movie) => (
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

            <Pagination
              currentPage={urlPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </div>
  );
}
