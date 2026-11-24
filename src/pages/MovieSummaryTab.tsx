import { useOutletContext } from 'react-router-dom';
import { MovieDetailOutletContext } from './MovieDetail';

function formatIndonesianDate(rawDate: string): string {
  if (!rawDate) return 'Tanggal rilis belum tersedia';
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return rawDate;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed);
}

export function MovieSummaryTab() {
  const { movie } = useOutletContext<MovieDetailOutletContext>();

  return (
    <section aria-label="Ringkasan film" className="max-w-[65ch]">
      <h2 className="font-display text-[20px] font-bold text-[var(--kertas)]">
        Ringkasan film
      </h2>
      <p className="mt-4 text-[16px] text-[var(--kertas)] leading-relaxed">
        {movie.overview
          ? movie.overview
          : 'Sinopsis dalam bahasa Indonesia belum tersedia untuk film ini.'}
      </p>

      <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[var(--tirai)] rounded-[10px] p-6">
        <div>
          <dt className="text-[14px] text-[var(--kertas-redup)]">Judul asli</dt>
          <dd className="mt-1 text-[16px] font-medium text-[var(--kertas)]">
            {movie.original_title || movie.title}
          </dd>
        </div>

        <div>
          <dt className="text-[14px] text-[var(--kertas-redup)]">
            Tanggal rilis
          </dt>
          <dd className="mt-1 text-[16px] font-medium text-[var(--kertas)] tabular-nums">
            {formatIndonesianDate(movie.release_date)}
          </dd>
        </div>

        <div>
          <dt className="text-[14px] text-[var(--kertas-redup)]">Durasi</dt>
          <dd className="mt-1 text-[16px] font-medium text-[var(--kertas)] tabular-nums">
            {movie.runtime && movie.runtime > 0
              ? `${movie.runtime} menit`
              : 'Belum tersedia'}
          </dd>
        </div>

        <div>
          <dt className="text-[14px] text-[var(--kertas-redup)]">
            Skor penonton
          </dt>
          <dd className="mt-1 text-[16px] font-medium text-[var(--kertas)] tabular-nums">
            {movie.vote_average > 0
              ? `${movie.vote_average.toFixed(1)} dari ${movie.vote_count.toLocaleString('id-ID')} suara`
              : 'Belum ada penilaian'}
          </dd>
        </div>
      </dl>
    </section>
  );
}
