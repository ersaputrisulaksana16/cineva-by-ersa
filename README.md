# Cineva

Aplikasi penemuan film berbahasa Indonesia dengan nuansa lobi bioskop malam hari, papan sorotan film terpopuler, dan tata letak karcis bioskop pada halaman detail film.

Cineva dibuat oleh **R Ersa Putri Sulaksana (NIM 1247050099)**.

## Menjalankan proyek

1. Pasang dependensi dengan `npm install`.
2. Salin `.env.example` menjadi `.env`, lalu isi `VITE_TMDB_API_KEY` dengan kunci API TMDB Anda.
3. Jalankan server pengembangan dengan `npm run dev`.

## Routing

Perutean aplikasi dibangun menggunakan `react-router-dom` v6 (`createBrowserRouter` dan `RouterProvider`) di `src/router.tsx`:

- `/` — Rute tata letak utama (`Layout`) yang merender `Navbar`, `<Outlet />`, dan `Footer`.
- `/` (index) — Halaman `Home` untuk sorotan film terpopuler, pencarian, filter genre, pengurutan, dan paginasi.
- `/movies/:id` — Halaman `MovieDetail` dengan tata letak karcis dan rute bersarang:
  - `/movies/:id` (index) — Tab **Ringkasan** (`MovieSummaryTab`).
  - `/movies/:id/notes` — Tab **Catatan** (`MovieNotesTab`) berisi formulir dan daftar catatan film.
- `/favorites` — Halaman `Favorites` untuk daftar film favorit yang disimpan.
- `/notes` — Halaman `Notes` untuk melihat dan menghapus seluruh catatan tontonan.
- `/about` — Halaman `About` berisi deskripsi aplikasi dan identitas pembuat.
- `*` — Halaman `NotFound` untuk alamat yang tidak ditemukan.

## Manajemen state

Aplikasi ini menerapkan lima jenis manajemen state secara terpisah dan terstruktur:

1. **State lokal (`useState`)**
   - Status buka/tutup menu seluler di `src/components/Navbar.tsx`.
   - Status tampil/sembunyi pemutar cuplikan video di `src/pages/MovieDetail.tsx`.
   - Status gambar fallback di `src/components/PosterImage.tsx`.
2. **State global (`Context API` + `localStorage`)**
   - `FavoritesContext` di `src/context/FavoritesContext.tsx` menyimpan daftar film favorit dengan kunci `cineva:favorites`.
   - `NotesContext` di `src/context/NotesContext.tsx` menyimpan daftar catatan film dengan kunci `cineva:notes`.
   - Riwayat pencarian juga disimpan di `localStorage` pada `src/components/SearchBar.tsx` dengan kunci `cineva:search-history`.
3. **State server (custom hooks + `AbortController`)**
   - `useMovies` dan `useSpotlightMovie` di `src/hooks/useMovies.ts`.
   - `useMovieDetail` di `src/hooks/useMovieDetail.ts`.
   - `useGenres` di `src/hooks/useGenres.ts`.
   - Seluruh hook mengembalikan `{ data, loading, error, refetch }` serta membatalkan permintaan tertunda menggunakan `AbortController`.
4. **State URL (`useSearchParams`)**
   - Halaman `src/pages/Home.tsx` menyimpan parameter `q`, `genre`, `sort`, dan `page` di URL sehingga memuat ulang atau membagikan tautan akan memulihkan tampilan yang sama.
5. **State formulir (komponen terkendali)**
   - Input pencarian di `src/components/SearchBar.tsx`.
   - Input `nama`, `catatan`, dan `rating` (1–5) beserta validasi di `src/components/NoteForm.tsx`.

## API

Seluruh panggilan jaringan ditempatkan di `src/services/tmdb.ts` menggunakan `fetch` bawaan peramban dengan `language=id-ID` pada setiap permintaan. Kunci API dibaca dari `import.meta.env.VITE_TMDB_API_KEY` hanya di `src/services/config.ts`.

Endpoint TMDB yang digunakan:

- `/discover/movie` — Mengambil daftar film populer, berdasarkan rating tertinggi, terbaru, judul A-Z, atau genre (`with_genres`).
- `/search/movie` — Mencari film berdasarkan kata kunci `q` (dengan filter genre dan pengurutan di sisi klien untuk halaman aktif).
- `/genre/movie/list` — Mengambil daftar genre film dalam bahasa Indonesia.
- `/movie/:id` — Mengambil detail film beserta daftar video cuplikan (`append_to_response=videos`).

## Custom hooks

- `useMovies` & `useSpotlightMovie` (`src/hooks/useMovies.ts`) — Mengambil daftar film dan film sorotan utama dengan `AbortController`.
- `useMovieDetail` (`src/hooks/useMovieDetail.ts`) — Memvalidasi ID film dan mengambil detail film dengan `AbortController`.
- `useGenres` (`src/hooks/useGenres.ts`) — Mengambil daftar genre dari TMDB dengan `AbortController`.
- `useDebounce` (`src/hooks/useDebounce.ts`) — Menunda pembaruan nilai input pencarian selama 500ms.
- `useLocalStorage` (`src/hooks/useLocalStorage.ts`) — Menyinkronkan state React dengan `localStorage` secara aman.

## Struktur folder

```text
src/
  components/   Komponen antarmuka yang dapat digunakan ulang (tanpa panggilan fetch)
  pages/        Halaman tingkat rute
  hooks/        Custom hooks untuk server state, debounce, dan localStorage
  services/     Konfigurasi TMDB dan seluruh fungsi pemanggilan API fetch
  context/      Provider Context API untuk favorit dan catatan
  types/        Definisi tipe TypeScript bersama
  router.tsx    Konfigurasi rute createBrowserRouter
  main.tsx      Titik masuk aplikasi dan pembungkus provider
```
