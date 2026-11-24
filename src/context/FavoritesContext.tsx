import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FavoriteMovie } from '../types/movie';

interface FavoritesContextValue {
  favorites: FavoriteMovie[];
  addFavorite: (movie: FavoriteMovie) => void;
  removeFavorite: (movieId: number) => void;
  toggleFavorite: (movie: FavoriteMovie) => void;
  isFavorite: (movieId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useLocalStorage<FavoriteMovie[]>(
    'cineva:favorites',
    []
  );

  const addFavorite = useCallback(
    (movie: FavoriteMovie) => {
      setFavorites((prev) => {
        if (prev.some((item) => item.id === movie.id)) return prev;
        return [movie, ...prev];
      });
    },
    [setFavorites]
  );

  const removeFavorite = useCallback(
    (movieId: number) => {
      setFavorites((prev) => prev.filter((item) => item.id !== movieId));
    },
    [setFavorites]
  );

  const toggleFavorite = useCallback(
    (movie: FavoriteMovie) => {
      setFavorites((prev) => {
        if (prev.some((item) => item.id === movie.id)) {
          return prev.filter((item) => item.id !== movie.id);
        }
        return [movie, ...prev];
      });
    },
    [setFavorites]
  );

  const isFavorite = useCallback(
    (movieId: number) => favorites.some((item) => item.id === movieId),
    [favorites]
  );

  const value = useMemo(
    () => ({
      favorites,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite,
    }),
    [favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites harus digunakan di dalam FavoritesProvider.');
  }
  return context;
}
