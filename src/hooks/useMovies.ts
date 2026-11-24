import { useCallback, useEffect, useState } from 'react';
import { fetchMovies, fetchSpotlightMovie } from '../services/tmdb';
import {
  MovieSummary,
  PaginatedMoviesResponse,
  SortOption,
} from '../types/movie';

interface UseMoviesOptions {
  query: string;
  genre: string;
  sort: SortOption;
  page: number;
}

export function useMovies({ query, genre, sort, page }: UseMoviesOptions) {
  const [data, setData] = useState<PaginatedMoviesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState<number>(0);

  const refetch = useCallback(() => {
    setReloadToken((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchMovies({
      query,
      genre,
      sort,
      page,
      signal: controller.signal,
    })
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const message =
          err instanceof Error
            ? err.message
            : 'Data film gagal dimuat. Periksa koneksi internet, lalu coba lagi.';
        setError(message);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [query, genre, sort, page, reloadToken]);

  return { data, loading, error, refetch };
}

export function useSpotlightMovie() {
  const [data, setData] = useState<MovieSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState<number>(0);

  const refetch = useCallback(() => {
    setReloadToken((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchSpotlightMovie(controller.signal)
      .then((movie) => {
        setData(movie);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const message =
          err instanceof Error
            ? err.message
            : 'Sorotan film gagal dimuat.';
        setError(message);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [reloadToken]);

  return { data, loading, error, refetch };
}
