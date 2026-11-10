import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createGenre } from "../../../services/api";

export default function GenreCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Nama genre wajib diisi.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await createGenre({
        name: form.name.trim(),
        description: form.description.trim() || null,
      });

      setSuccess({
        message: `Genre "${res.data.name}" berhasil ditambahkan!`,
        source: res.source,
      });

      // Reset form
      setForm({ name: "", description: "" });

      // Redirect setelah 1.5 detik
      setTimeout(() => {
        navigate("/admin/genres");
      }, 1400);
    } catch (err) {
      console.error("Gagal menambahkan genre:", err);
      setError(err.response?.data?.message || "Terjadi kesalahan saat menambahkan genre.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb & Navigation */}
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
              <Link to="/admin/genres" className="hover:text-indigo-600 dark:hover:text-white">
                Genre
              </Link>
            </li>
            <li>
              <span className="mx-1">/</span>
              <span className="text-gray-700 dark:text-gray-200 font-medium">Tambah Baru</span>
            </li>
          </ol>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tambah Genre Buku Baru
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Isi data formulir di bawah ini untuk menambahkan kategori buku ke katalog sistem.
            </p>
          </div>
          <Link
            to="/admin/genres"
            className="inline-flex items-center px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-300">
              ✓
            </div>
            <div>
              <p className="font-semibold">{success.message}</p>
              <p className="text-xs opacity-80">
                Tersimpan via: {success.source === "api" ? "REST API Laravel" : "Penyimpanan Lokal"} · Mengarahkan ke halaman daftar...
              </p>
            </div>
          </div>
          <Link
            to="/admin/genres"
            className="text-xs underline font-semibold text-emerald-700 dark:text-emerald-300 hover:opacity-80"
          >
            Lihat Sekarang →
          </Link>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-300 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center font-bold text-red-600 dark:text-red-300">
            !
          </div>
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Genre */}
            <div>
              <label
                htmlFor="genre-name"
                className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
              >
                Nama Genre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="genre-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Misal: Fiksi Ilmiah, Fantasi, Psikologi, Komik"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition"
                required
              />
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Nama kategori harus spesifik dan mudah dikenali oleh pembaca.
              </p>
            </div>

            {/* Deskripsi Genre */}
            <div>
              <label
                htmlFor="genre-description"
                className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
              >
                Deskripsi Genre <span className="text-xs text-gray-400 font-normal">(Opsional)</span>
              </label>
              <textarea
                id="genre-description"
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Jelaskan karakteristik, topik umum, atau tema yang dicakup oleh genre ini..."
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition"
              />
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                Deskripsi membantu kurator buku menentukan penempatan kategori.
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 disabled:opacity-50 transition"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Simpan Genre
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setForm({ name: "", description: "" })}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Pratinjau Langsung (Live Preview)
            </span>
            <h3 className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Tampilan badge & kartu genre:
            </h3>

            <div className="mt-4 p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 space-y-3">
              <div>
                <span className="text-xs text-gray-400 block mb-1">Badge Kategori:</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  {form.name || "Nama Genre Anda"}
                </span>
              </div>

              <div>
                <span className="text-xs text-gray-400 block mb-1">Deskripsi Ringkas:</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {form.description || "Deskripsi genre akan tampil di sini saat Anda mengetik..."}
                </p>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-800 dark:text-indigo-300 space-y-1">
              <p className="font-semibold">💡 Tips CRUD React JS:</p>
              <p>Proses penambahan menggunakan <code>axios.post</code> dengan teknik asynchronous dan update state dinamis.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

