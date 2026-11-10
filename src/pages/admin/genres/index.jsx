import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getGenres, deleteGenre } from "../../../services/api";

export default function AdminGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dataSource, setDataSource] = useState("api");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [notification, setNotification] = useState(null);

  const fetchGenresData = async () => {
    setLoading(true);
    try {
      const res = await getGenres();
      setGenres(res.data);
      setDataSource(res.source);
    } catch (err) {
      console.error("Gagal memuat genre:", err);
      setNotification({ type: "error", message: "Gagal memuat data genre." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenresData();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.item) return;
    try {
      await deleteGenre(deleteModal.item.id);
      setGenres((prev) => prev.filter((g) => g.id !== deleteModal.item.id));
      setNotification({
        type: "success",
        message: `Genre "${deleteModal.item.name}" berhasil dihapus.`,
      });
    } catch (err) {
      setNotification({ type: "error", message: "Gagal menghapus genre." });
    } finally {
      setDeleteModal({ isOpen: false, item: null });
    }
  };

  const filteredGenres = genres.filter((genre) => {
    const q = searchTerm.toLowerCase();
    const nameMatch = genre.name ? genre.name.toLowerCase().includes(q) : false;
    const descMatch = genre.description ? genre.description.toLowerCase().includes(q) : false;
    return nameMatch || descMatch;
  });

  // Warna badge dinamis untuk genre
  const genreBadgeColors = [
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-200",
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200",
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200",
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 border-emerald-200",
    "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200",
    "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300 border-rose-200",
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <nav className="flex mb-2 text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li>
                <Link to="/admin" className="hover:text-indigo-600 dark:hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <span className="mx-1">/</span>
                <span className="text-gray-700 dark:text-gray-200 font-medium">Genre</span>
              </li>
            </ol>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Kelola Data Genre
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
              {genres.length} Total Genre
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Daftar kategori dan genre buku yang terintegrasi dengan API backend perpustakaan.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchGenresData}
            title="Refresh Data"
            className="p-2.5 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-900 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition"
          >
            <svg
              className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <Link
            to="/admin/genres/create"
            className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 shadow-sm transition"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Tambah Genre
          </Link>
        </div>
      </div>

      {/* Notifikasi Alert */}
      {notification && (
        <div
          className={`p-4 rounded-lg flex items-center justify-between text-sm ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800"
              : "bg-red-50 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{notification.type === "success" ? "✓" : "⚠"}</span>
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="font-bold hover:opacity-75"
          >
            ✕
          </button>
        </div>
      )}

      {/* Status Bar Sumber Data */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              dataSource === "api" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
            }`}
          />
          <span>
            Sumber Data:{" "}
            <strong>
              {dataSource === "api" ? "REST API Laravel (Live Server)" : "Penyimpanan Lokal (Offline Fallback)"}
            </strong>
          </span>
        </div>
        <span className="text-gray-500">Method: <code>GET /api/genres</code></span>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-gray-800 relative shadow-sm border border-gray-200 dark:border-gray-700 sm:rounded-xl overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan nama atau deskripsi genre..."
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
            <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-50 dark:bg-gray-750 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th scope="col" className="px-5 py-3.5 w-16 text-center">
                  #
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Nama Genre
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Deskripsi
                </th>
                <th scope="col" className="px-5 py-3.5 w-44">
                  Terdaftar Pada
                </th>
                <th scope="col" className="px-5 py-3.5 w-32 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Memuat data genre...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredGenres.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 dark:bg-gray-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        {searchTerm ? "Tidak ada genre yang cocok dengan pencarian." : "Belum ada data genre."}
                      </p>
                      <Link
                        to="/admin/genres/create"
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                      >
                        + Tambah genre sekarang
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredGenres.map((genre, idx) => {
                  const colorClass = genreBadgeColors[idx % genreBadgeColors.length];
                  return (
                    <tr
                      key={genre.id}
                      className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-5 py-4 text-center text-gray-400 font-mono text-xs">
                        {idx + 1}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                          {genre.name}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-300 max-w-md">
                        {genre.description ? (
                          <span className="line-clamp-2">{genre.description}</span>
                        ) : (
                          <span className="text-gray-400 italic text-xs">
                            Tidak ada deskripsi
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                        {genre.created_at
                          ? new Date(genre.created_at).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "-"}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-center space-x-1.5">
                        <Link
                          to={`/admin/genres/edit/${genre.id}`}
                          className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-lg border border-indigo-200 dark:border-indigo-800 transition shadow-sm"
                          title="Edit & Perbarui Genre"
                        >
                          <svg
                            className="w-3.5 h-3.5 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, item: genre })}
                          className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-red-600 hover:text-white hover:bg-red-600 rounded-lg border border-red-200 dark:border-red-800 transition shadow-sm"
                          title="Hapus Genre"
                        >
                          <svg
                            className="w-3.5 h-3.5 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">
          <span>Menampilkan <strong>{filteredGenres.length}</strong> dari <strong>{genres.length}</strong> genre</span>
          <span>Sistem CRUD React JS Lanjutan</span>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Hapus Genre Ini?
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Genre <strong>"{deleteModal.item?.name}"</strong> akan dihapus dari sistem.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, item: null })}
                className="w-1/2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="w-1/2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

