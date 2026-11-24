import { useCallback, useEffect, useState } from 'react';
import { fetchMovieDetail } from '../services/tmdb';
import { MovieDetailData } from '../types/movie';

export function useMovieDetail(movieId: string | undefined) {
  const [data, setData] = useState<MovieDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState<number>(0);

  const refetch = useCallback(() => {
    setReloadToken((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!movieId) {
      setData(null);
      setError('ID film tidak ditemukan. Kembali ke beranda untuk memilih film.');
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchMovieDetail(movieId, controller.signal)
      .then((movie) => {
        setData(movie);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const message =
          err instanceof Error
            ? err.message
            : 'Detail film gagal dimuat. Periksa koneksi internet, lalu coba lagi.';
        setData(null);
        setError(message);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [movieId, reloadToken]);

  return { data, loading, error, refetch };
}
