import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function About() {
  useEffect(() => {
    document.title = 'Tentang — Cineva';
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 pt-10 pb-16">
      <h1 className="font-display text-[28px] md:text-[44px] font-bold text-[var(--kertas)] leading-tight">
        Tentang Cineva
      </h1>

      <div className="mt-6 space-y-5 text-[16px] text-[var(--kertas)] leading-relaxed max-w-[65ch]">
        <p>
          Cineva adalah aplikasi penemuan film berbahasa Indonesia yang terinspirasi dari suasana lobi bioskop pada malam hari. Anda dapat mencari judul film, menyaring berdasarkan genre, mengurutkan daftar film, menyimpan film favorit, serta menulis catatan tontonan pribadi.
        </p>
        <p>
          Data film, poster, genre, dan sinopsis ditampilkan menggunakan layanan The Movie Database (TMDB) dengan pengaturan bahasa Indonesia.
        </p>
      </div>

      <section
        aria-label="Identitas pembuat"
        className="mt-10 bg-[var(--tirai)] rounded-[10px] p-6 max-w-xl"
      >
        <h2 className="font-display text-[20px] font-bold text-[var(--kertas)]">
          Pembuat aplikasi
        </h2>
        <p className="mt-3 text-[16px] text-[var(--kertas)]">
          Cineva dibuat oleh R Ersa Putri Sulaksana (NIM 1247050099)
        </p>
      </section>

      <div className="mt-8">
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded-[10px] bg-[var(--lampu)] text-[#1E122E] text-[14px] font-semibold hover:opacity-90 transition-opacity duration-150"
        >
          Jelajah film
        </Link>
      </div>
    </div>
  );
}
