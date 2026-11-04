import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getGenres, getAuthors } from "../../services/api";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    genres: 0,
    authors: 0,
    books: 9,
    transactions: 3,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [genreRes, authorRes] = await Promise.all([
          getGenres(),
          getAuthors(),
        ]);
        setCounts((prev) => ({
          ...prev,
          genres: genreRes.data.length,
          authors: authorRes.data.length,
        }));
      } catch (e) {
        console.error("Dashboard data load error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <span>✨</span> Panel Administrasi Ruang Baca
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang di Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-indigo-100 leading-relaxed">
            Sistem manajemen konten perpustakaan dan toko buku. Kelola data master kategori genre, penulis, buku, serta transaksi secara real-time.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/admin/genres/create"
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-indigo-900 bg-white rounded-lg shadow-sm hover:bg-indigo-50 transition"
            >
              + Tambah Genre
            </Link>
            <Link
              to="/admin/authors/create"
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-indigo-500/40 hover:bg-indigo-500/60 rounded-lg backdrop-blur-sm border border-white/20 transition"
            >
              + Tambah Penulis
            </Link>
          </div>
        </div>
        {/* Dekorasi lingkaran background */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card Genre */}
        <div className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-600 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Data Genre
            </span>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? "..." : counts.genres}
            </span>
            <Link
              to="/admin/genres"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Kelola Genre →
            </Link>
          </div>
        </div>

        {/* Card Author */}
        <div className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:border-purple-300 dark:hover:border-purple-600 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Data Penulis
            </span>
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? "..." : counts.authors}
            </span>
            <Link
              to="/admin/authors"
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
            >
              Kelola Penulis →
            </Link>
          </div>
        </div>

        {/* Card Books */}
        <div className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:border-emerald-300 dark:hover:border-emerald-600 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Koleksi Buku
            </span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {counts.books}
            </span>
            <Link
              to="/admin/books"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Lihat Buku →
            </Link>
          </div>
        </div>

        {/* Card Transactions */}
        <div className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:border-amber-300 dark:hover:border-amber-600 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Transaksi
            </span>
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {counts.transactions}
            </span>
            <Link
              to="/admin/transactions"
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Lihat Transaksi →
            </Link>
          </div>
        </div>
      </div>

      {/* Info & Tugas Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📌</span> Tugas 1 React JS Lanjutan
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Implementasi operasi <strong>CRUD (Create &amp; Read)</strong> di React JS menggunakan teknik <strong>Asynchronous</strong> dan pustaka <strong>Axios</strong> untuk entitas:
          </p>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span><strong>Genre:</strong> Read data via <code>GET /api/genres</code> dan Create data via <code>POST /api/genres</code>.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span><strong>Author:</strong> Read data via <code>GET /api/authors</code> dan Create data via <code>POST /api/authors</code>.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span><strong>Desain Kreatif:</strong> Desain antarmuka modern dengan Tailwind CSS &amp; Flowbite UI.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>⚙️</span> Integrasi Arsitektur
          </h2>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
              <span className="font-semibold block text-gray-800 dark:text-gray-200">Backend API:</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Laravel 11 REST API di <code>http://127.0.0.1:8000/api</code></span>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
              <span className="font-semibold block text-gray-800 dark:text-gray-200">State Management:</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">React Hooks (<code>useState</code>, <code>useEffect</code>, <code>useNavigate</code>)</span>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg">
              <span className="font-semibold block text-gray-800 dark:text-gray-200">Offline Fallback:</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">LocalStorage synchronization saat backend server tidak aktif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
