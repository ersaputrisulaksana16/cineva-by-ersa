import { CheckCircle2, Star } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useNotes } from '../context/NotesContext';

interface NoteFormProps {
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
}

interface FormTouched {
  nama: boolean;
  catatan: boolean;
  rating: boolean;
}

function validateNama(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Nama wajib diisi.';
  if (trimmed.length < 3) return 'Nama minimal 3 karakter.';
  return '';
}

function validateCatatan(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Catatan wajib diisi.';
  if (trimmed.length < 10) return 'Catatan minimal 10 karakter.';
  if (trimmed.length > 300) return 'Catatan maksimal 300 karakter.';
  return '';
}

function validateRating(value: number): string {
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return 'Rating wajib dipilih antara 1 sampai 5.';
  }
  return '';
}

export function NoteForm({ movieId, movieTitle, posterPath }: NoteFormProps) {
  const { addNote } = useNotes();

  const [nama, setNama] = useState('');
  const [catatan, setCatatan] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [touched, setTouched] = useState<FormTouched>({
    nama: false,
    catatan: false,
    rating: false,
  });
  const [submittedAttempt, setSubmittedAttempt] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const namaError = validateNama(nama);
  const catatanError = validateCatatan(catatan);
  const ratingError = validateRating(rating);
  const isValid = !namaError && !catatanError && !ratingError;

  const showNamaError = (touched.nama || submittedAttempt) && Boolean(namaError);
  const showCatatanError =
    (touched.catatan || submittedAttempt) && Boolean(catatanError);
  const showRatingError =
    (touched.rating || submittedAttempt) && Boolean(ratingError);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedAttempt(true);

    if (!isValid) return;

    addNote({
      movieId,
      movieTitle,
      posterPath,
      nama,
      catatan,
      rating,
    });

    setNama('');
    setCatatan('');
    setRating(0);
    setTouched({ nama: false, catatan: false, rating: false });
    setSubmittedAttempt(false);
    setSavedFeedback(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-[var(--tirai)] rounded-[10px] p-6 max-w-xl"
    >
      <h2 className="font-display text-[20px] font-bold text-[var(--kertas)]">
        Tulis catatan tontonan
      </h2>

      {savedFeedback && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-[10px] bg-[var(--layar)] border border-[var(--tosca)] text-[14px] text-[var(--tosca)] font-medium"
        >
          <CheckCircle2 size={18} aria-hidden="true" className="shrink-0" />
          <span>Catatan disimpan</span>
        </div>
      )}

      <div className="mt-5">
        <label
          htmlFor="note-nama"
          className="block text-[14px] font-medium text-[var(--kertas)] mb-2"
        >
          Nama
        </label>
        <input
          id="note-nama"
          type="text"
          value={nama}
          onChange={(event) => {
            setNama(event.target.value);
            if (savedFeedback) setSavedFeedback(false);
          }}
          onBlur={() => setTouched((prev) => ({ ...prev, nama: true }))}
          placeholder="Tulis nama Anda"
          aria-invalid={showNamaError}
          aria-describedby={showNamaError ? 'note-nama-error' : undefined}
          className="w-full h-11 px-4 rounded-[10px] bg-[var(--layar)] border border-[#5B417E] text-[16px] text-[var(--kertas)] placeholder:text-[var(--kertas-redup)]"
        />
        {showNamaError && (
          <p
            id="note-nama-error"
            className="mt-1.5 text-[14px] text-[var(--karcis)]"
          >
            {namaError}
          </p>
        )}
      </div>

      <div className="mt-5">
        <span className="block text-[14px] font-medium text-[var(--kertas)] mb-2">
          Rating (1 sampai 5)
        </span>
        <div
          role="radiogroup"
          aria-label="Pilih rating 1 sampai 5"
          className="flex flex-wrap items-center gap-2"
        >
          {[1, 2, 3, 4, 5].map((value) => {
            const active = rating === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => {
                  setRating(value);
                  setTouched((prev) => ({ ...prev, rating: true }));
                  if (savedFeedback) setSavedFeedback(false);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[14px] font-semibold tabular-nums transition-colors duration-150 ${
                  active
                    ? 'bg-[var(--lampu)] text-[#1E122E]'
                    : 'bg-[var(--layar)] text-[var(--kertas)] border border-[#5B417E] hover:border-[var(--lampu)]'
                }`}
              >
                <Star
                  size={15}
                  aria-hidden="true"
                  className={
                    active
                      ? 'fill-[#1E122E] text-[#1E122E]'
                      : 'text-[var(--lampu)]'
                  }
                />
                <span>{value}</span>
              </button>
            );
          })}
        </div>
        {showRatingError && (
          <p className="mt-1.5 text-[14px] text-[var(--karcis)]">
            {ratingError}
          </p>
        )}
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="note-catatan"
            className="block text-[14px] font-medium text-[var(--kertas)]"
          >
            Catatan
          </label>
          <span className="text-[14px] text-[var(--kertas-redup)] tabular-nums">
            {catatan.trim().length}/300
          </span>
        </div>
        <textarea
          id="note-catatan"
          rows={4}
          value={catatan}
          onChange={(event) => {
            setCatatan(event.target.value);
            if (savedFeedback) setSavedFeedback(false);
          }}
          onBlur={() => setTouched((prev) => ({ ...prev, catatan: true }))}
          placeholder="Tulis kesan atau catatan Anda tentang film ini (10 sampai 300 karakter)"
          aria-invalid={showCatatanError}
          aria-describedby={showCatatanError ? 'note-catatan-error' : undefined}
          className="w-full p-4 rounded-[10px] bg-[var(--layar)] border border-[#5B417E] text-[16px] text-[var(--kertas)] placeholder:text-[var(--kertas-redup)] resize-y"
        />
        {showCatatanError && (
          <p
            id="note-catatan-error"
            className="mt-1.5 text-[14px] text-[var(--karcis)]"
          >
            {catatanError}
          </p>
        )}
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={!isValid}
          className="px-6 py-2.5 rounded-[10px] bg-[var(--lampu)] text-[#1E122E] text-[16px] font-semibold whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity duration-150"
        >
          Simpan catatan
        </button>
      </div>
    </form>
  );
}
