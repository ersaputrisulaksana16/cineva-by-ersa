export const TMDB_API_KEY: string = (
  import.meta.env.VITE_TMDB_API_KEY ?? ''
).trim();

export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

export function isTmdbConfigured(): boolean {
  return TMDB_API_KEY.length > 0 && TMDB_API_KEY !== 'MASUKKAN_KUNCI_API_TMDB_ANDA';
}

export function getPosterUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return `${POSTER_BASE_URL}${path}`;
}

export function getBackdropUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return `${BACKDROP_BASE_URL}${path}`;
}
