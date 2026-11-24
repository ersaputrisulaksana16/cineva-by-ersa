import { Star, Trash2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { NoteForm } from '../components/NoteForm';
import { useNotes } from '../context/NotesContext';
import { MovieDetailOutletContext } from './MovieDetail';

function formatNoteDate(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed);
}

export function MovieNotesTab() {
  const { movie } = useOutletContext<MovieDetailOutletContext>();
  const { getNotesByMovieId, deleteNote } = useNotes();
  const movieNotes = getNotesByMovieId(movie.id);

  return (
    <section aria-label="Catatan untuk film ini" className="space-y-10">
      <NoteForm
        movieId={movie.id}
        movieTitle={movie.title}
        posterPath={movie.poster_path}
      />

      <div>
        <h2 className="font-display text-[20px] font-bold text-[var(--kertas)]">
          Daftar catatan ({movieNotes.length})
        </h2>

        {movieNotes.length === 0 ? (
          <div className="mt-4">
            <EmptyState message="Belum ada catatan untuk film ini. Gunakan formulir di atas untuk menyimpan catatan pertama Anda." />
          </div>
        ) : (
          <ul className="mt-5 space-y-4 max-w-xl">
            {movieNotes.map((note) => (
              <li
                key={note.id}
                className="bg-[var(--tirai)] rounded-[10px] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[16px] font-semibold text-[var(--kertas)]">
                      {note.nama}
                    </p>
                    <p className="mt-0.5 text-[14px] text-[var(--kertas-redup)] tabular-nums">
                      {formatNoteDate(note.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-[var(--lampu)] text-[#1E122E] text-[14px] font-semibold tabular-nums">
                      <Star
                        size={14}
                        aria-hidden="true"
                        className="fill-[#1E122E]"
                      />
                      <span>{note.rating}/5</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => deleteNote(note.id)}
                      aria-label={`Hapus catatan dari ${note.nama}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[var(--layar)] text-[14px] text-[var(--karcis)] font-medium hover:opacity-90"
                    >
                      <Trash2 size={15} aria-hidden="true" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-[16px] text-[var(--kertas)] leading-relaxed max-w-[65ch]">
                  {note.catatan}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
