import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  useEffect(() => {
    document.title = 'Halaman tidak ditemukan — Cineva';
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 pt-12 pb-16">
      <h1 className="font-display text-[44px] md:text-[64px] font-bold text-[var(--lampu)] leading-none tabular-nums">
        404
      </h1>
      <h2 className="mt-4 font-display text-[28px] font-bold text-[var(--kertas)] leading-tight">
        Halaman tidak ditemukan
      </h2>
      <p className="mt-3 text-[16px] text-[var(--kertas-redup)] max-w-[65ch]">
        Alamat yang Anda buka tidak tersedia di Cineva. Kembali ke halaman utama untuk melanjutkan pencarian film.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-block px-6 py-2.5 rounded-[10px] bg-[var(--lampu)] text-[#1E122E] text-[16px] font-semibold hover:opacity-90 transition-opacity duration-150"
        >
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
