import {
  Genre,
  MovieDetailData,
  MovieSummary,
  PaginatedMoviesResponse,
  SortOption,
} from '../types/movie';
import { isTmdbConfigured, TMDB_API_KEY, TMDB_BASE_URL } from './config';

export class TmdbConfigError extends Error {
  constructor() {
    super(
      'Kunci API TMDB belum diatur. Tambahkan VITE_TMDB_API_KEY pada file .env di akar proyek, lalu muat ulang halaman.'
    );
    this.name = 'TmdbConfigError';
  }
}

export class TmdbRequestError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'TmdbRequestError';
    this.status = status;
  }
}

const SORT_MAP: Record<SortOption, string> = {
  popular: 'popularity.desc',
  rating: 'vote_average.desc',
  newest: 'primary_release_date.desc',
  title: 'original_title.asc',
};

function isBearerToken(key: string): boolean {
  return key.startsWith('eyJ');
}

async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string | number | undefined> = {},
  signal?: AbortSignal
): Promise<T> {
  if (!isTmdbConfigured()) {
    throw new TmdbConfigError();
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set('language', 'id-ID');

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (isBearerToken(TMDB_API_KEY)) {
    headers.Authorization = `Bearer ${TMDB_API_KEY}`;
  } else {
    url.searchParams.set('api_key', TMDB_API_KEY);
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: 'GET',
      headers,
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    throw new TmdbRequestError(
      'Data film gagal dimuat. Periksa koneksi internet, lalu coba lagi.'
    );
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new TmdbRequestError(
        'Kunci API TMDB tidak valid atau kedaluwarsa. Periksa nilai VITE_TMDB_API_KEY, lalu muat ulang halaman.',
        401
      );
    }
    if (response.status === 404) {
      throw new TmdbRequestError(
        'Data film tidak ditemukan. Periksa alamat atau ID film yang dituju.',
        404
      );
    }
    throw new TmdbRequestError(
      'Data film gagal dimuat dari server. Tunggu sebentar, lalu coba lagi.',
      response.status
    );
  }

  return (await response.json()) as T;
}

export function sortMoviesClient(
  movies: MovieSummary[],
  sort: SortOption
): MovieSummary[] {
  const copy = [...movies];
  switch (sort) {
    case 'rating':
      return copy.sort((a, b) => b.vote_average - a.vote_average);
    case 'newest':
      return copy.sort((a, b) => {
        const dateA = a.release_date ? Date.parse(a.release_date) : 0;
        const dateB = b.release_date ? Date.parse(b.release_date) : 0;
        return dateB - dateA;
      });
    case 'title':
      return copy.sort((a, b) =>
        (a.original_title || a.title).localeCompare(
          b.original_title || b.title,
          'id'
        )
      );
    case 'popular':
    default:
      return copy.sort((a, b) => b.popularity - a.popularity);
  }
}

export interface FetchMoviesParams {
  query?: string;
  genre?: string;
  sort?: SortOption;
  page?: number;
  signal?: AbortSignal;
}

export async function fetchMovies({
  query = '',
  genre = '',
  sort = 'popular',
  page = 1,
  signal,
}: FetchMoviesParams): Promise<PaginatedMoviesResponse> {
  const trimmedQuery = query.trim();
  const safePage = Math.max(1, Math.min(500, Math.floor(page) || 1));

  if (trimmedQuery.length > 0) {
    const data = await tmdbFetch<PaginatedMoviesResponse>(
      '/search/movie',
      {
        query: trimmedQuery,
        page: safePage,
        include_adult: 'false',
      },
      signal
    );

    let filtered = data.results;
    if (genre) {
      const genreId = Number(genre);
      if (Number.isFinite(genreId)) {
        filtered = filtered.filter((movie) =>
          movie.genre_ids.includes(genreId)
        );
      }
    }

    const sorted = sortMoviesClient(filtered, sort);

    return {
      ...data,
      results: sorted,
      total_pages: Math.min(500, data.total_pages || 1),
    };
  }

  const discoverParams: Record<string, string | number | undefined> = {
    page: safePage,
    sort_by: SORT_MAP[sort] ?? 'popularity.desc',
    with_genres: genre || undefined,
    include_adult: 'false',
  };

  if (sort === 'rating') {
    discoverParams['vote_count.gte'] = 50;
  }

  const data = await tmdbFetch<PaginatedMoviesResponse>(
    '/discover/movie',
    discoverParams,
    signal
  );

  return {
    ...data,
    total_pages: Math.min(500, data.total_pages || 1),
  };
}

export async function fetchSpotlightMovie(
  signal?: AbortSignal
): Promise<MovieSummary | null> {
  const data = await tmdbFetch<PaginatedMoviesResponse>(
    '/discover/movie',
    {
      page: 1,
      sort_by: 'popularity.desc',
      include_adult: 'false',
    },
    signal
  );

  return data.results[0] ?? null;
}

export async function fetchGenres(signal?: AbortSignal): Promise<Genre[]> {
  const data = await tmdbFetch<{ genres: Genre[] }>(
    '/genre/movie/list',
    {},
    signal
  );
  return data.genres;
}

export async function fetchMovieDetail(
  movieId: string,
  signal?: AbortSignal
): Promise<MovieDetailData> {
  const parsedId = Number(movieId);
  if (!/^\d+$/.test(movieId) || !Number.isInteger(parsedId) || parsedId <= 0) {
    throw new TmdbRequestError(
      'ID film tidak valid. Periksa tautan film, lalu kembali ke beranda.',
      400
    );
  }

  return tmdbFetch<MovieDetailData>(
    `/movie/${parsedId}`,
    {
      append_to_response: 'videos',
      include_video_language: 'id,en,null',
    },
    signal
  );
}
