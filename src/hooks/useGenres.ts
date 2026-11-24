import { useCallback, useEffect, useState } from 'react';
import { fetchGenres } from '../services/tmdb';
import { Genre } from '../types/movie';

export function useGenres() {
  const [data, setData] = useState<Genre[]>([]);
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

    fetchGenres(controller.signal)
      .then((genres) => {
        setData(genres);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const message =
          err instanceof Error
            ? err.message
            : 'Daftar genre gagal dimuat. Periksa koneksi internet, lalu coba lagi.';
        setError(message);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [reloadToken]);

  return { data, loading, error, refetch };
}
