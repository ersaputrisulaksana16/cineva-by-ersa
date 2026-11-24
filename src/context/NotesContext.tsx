import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { MovieNote } from '../types/movie';

export interface NewNoteInput {
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
  nama: string;
  catatan: string;
  rating: number;
}

interface NotesContextValue {
  notes: MovieNote[];
  addNote: (input: NewNoteInput) => MovieNote;
  deleteNote: (noteId: string) => void;
  getNotesByMovieId: (movieId: number) => MovieNote[];
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

function generateNoteId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useLocalStorage<MovieNote[]>('cineva:notes', []);

  const addNote = useCallback(
    (input: NewNoteInput): MovieNote => {
      const newNote: MovieNote = {
        id: generateNoteId(),
        movieId: input.movieId,
        movieTitle: input.movieTitle,
        posterPath: input.posterPath,
        nama: input.nama.trim(),
        catatan: input.catatan.trim(),
        rating: input.rating,
        createdAt: new Date().toISOString(),
      };
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    },
    [setNotes]
  );

  const deleteNote = useCallback(
    (noteId: string) => {
      setNotes((prev) => prev.filter((item) => item.id !== noteId));
    },
    [setNotes]
  );

  const getNotesByMovieId = useCallback(
    (movieId: number) => notes.filter((item) => item.movieId === movieId),
    [notes]
  );

  const value = useMemo(
    () => ({
      notes,
      addNote,
      deleteNote,
      getNotesByMovieId,
    }),
    [notes, addNote, deleteNote, getNotesByMovieId]
  );

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes harus digunakan di dalam NotesProvider.');
  }
  return context;
}
