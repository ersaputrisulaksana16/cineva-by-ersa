import { Star, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { useNotes } from '../context/NotesContext';

function formatNoteDate(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed);
}

export function Notes() {
  const { notes, deleteNote } = useNotes();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Catatan — Cineva';
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 pt-10 pb-16">
      <h1 className="font-display text-[28px] md:text-[44px] font-bold text-[var(--kertas)] leading-tight">
        Semua catatan
      </h1>
      <p className="mt-3 text-[16px] text-[var(--kertas-redup)] max-w-[65ch]">
        Kumpulan catatan dan penilaian pribadi Anda dari setiap film yang pernah Anda ulas.
      </p>

      <div className="mt-8">
        {notes.length === 0 ? (
          <EmptyState
            message="Belum ada catatan yang tersimpan. Buka halaman detail film lalu pilih tab Catatan untuk menulis ulasan pertama Anda."
            actionLabel="Jelajah film"
            onAction={() => navigate('/')}
          />
        ) : (
          <ul className="space-y-5 max-w-2xl">
            {notes.map((note) => (
              <li
                key={note.id}
                className="bg-[var(--tirai)] rounded-[10px] p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Link
                      to={`/movies/${note.movieId}/notes`}
                      className="font-display text-[20px] font-bold text-[var(--lampu)] hover:underline underline-offset-4"
                    >
                      {note.movieTitle}
                    </Link>
                    <p className="mt-1 text-[14px] text-[var(--kertas-redup)]">
                      Ditulis oleh{' '}
                      <span className="text-[var(--kertas)] font-medium">
                        {note.nama}
                      </span>{' '}
                      pada{' '}
                      <span className="tabular-nums">
                        {formatNoteDate(note.createdAt)}
                      </span>
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
                      aria-label={`Hapus catatan untuk ${note.movieTitle}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-[var(--layar)] text-[14px] text-[var(--karcis)] font-medium hover:opacity-90"
                    >
                      <Trash2 size={15} aria-hidden="true" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-[16px] text-[var(--kertas)] leading-relaxed max-w-[65ch]">
                  {note.catatan}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
