import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuthorById, updateAuthor } from "../../../services/api";

export default function AuthorEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    nationality: "Indonesia",
    description: "",
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function loadAuthor() {
      setInitialLoading(true);
      setError(null);
      try {
        const res = await getAuthorById(id);
        if (res.data) {
          setForm({
            name: res.data.name || "",
            nationality: res.data.nationality || "Indonesia",
            description: res.data.description || "",
          });
        } else {
          setError(`Data penulis dengan ID #${id} tidak ditemukan.`);
        }
      } catch (err) {
        console.error("Gagal memuat detail penulis:", err);
        setError("Gagal memuat data penulis untuk diedit.");
      } finally {
        setInitialLoading(false);
      }
    }
    loadAuthor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const getInitials = (name) => {
    if (!name.trim()) return "??";
    return name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Nama lengkap penulis wajib diisi.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await updateAuthor(id, {
        name: form.name.trim(),
        nationality: form.nationality.trim() || "Indonesia",
        description: form.description.trim() || null,
      });

      setSuccess({
        message: `Data penulis "${res.data.name}" berhasil diperbarui!`,
        source: res.source,
      });

      // Redirect otomatis setelah 1.4 detik
      setTimeout(() => {
        navigate("/admin/authors");
      }, 1400);
    } catch (err) {
      console.error("Gagal memperbarui data penulis:", err);
      setError(err.response?.data?.message || "Terjadi kesalahan saat memperbarui data penulis.");
    } finally {
      setSubmitting(false);
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
              <Link to="/admin/authors" className="hover:text-indigo-600 dark:hover:text-white">
                Penulis
              </Link>
            </li>
            <li>
              <span className="mx-1">/</span>
              <span className="text-gray-700 dark:text-gray-200 font-medium">Edit Penulis #{id}</span>
            </li>
          </ol>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit &amp; Perbarui Data Penulis
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Perbarui profil dan biografi pengarang (Operasi UPDATE via HTTP PUT / Axios).
            </p>
          </div>
          <Link
            to="/admin/authors"
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
                Tersimpan via: {success.source === "api" ? "REST API Laravel (PUT)" : "Penyimpanan Lokal"} · Mengarahkan ke daftar penulis...
              </p>
            </div>
          </div>
          <Link
            to="/admin/authors"
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

      {initialLoading ? (
        <div className="p-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Memuat profil penulis untuk diedit...
          </p>
        </div>
      ) : (
        /* Form & Live Preview Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Column */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama Penulis */}
              <div>
                <label
                  htmlFor="author-name"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                >
                  Nama Lengkap Penulis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="author-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Misal: Andrea Hirata, Tere Liye, Pramoedya Ananta Toer"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition"
                  required
                />
              </div>

              {/* Kewarganegaraan */}
              <div>
                <label
                  htmlFor="author-nationality"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                >
                  Kewarganegaraan / Asal Negara
                </label>
                <input
                  type="text"
                  id="author-nationality"
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChange}
                  placeholder="Misal: Indonesia, Jepang, Inggris, Amerika Serikat"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-xs text-gray-400 mr-1 self-center">Pilihan cepat:</span>
                  {["Indonesia", "Jepang", "Inggris", "Amerika Serikat", "Malaysia"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, nationality: c }))}
                      className="px-2 py-0.5 text-xs rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Biografi / Deskripsi */}
              <div>
                <label
                  htmlFor="author-description"
                  className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                >
                  Biografi / Deskripsi Singkat <span className="text-xs text-gray-400 font-normal">(Opsional)</span>
                </label>
                <textarea
                  id="author-description"
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tuliskan latar belakang singkat penulis, genre spesialisasi, atau karya terkenalnya..."
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition"
                />
              </div>

              {/* Tombol Aksi */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 disabled:opacity-50 transition"
                >
                  {submitting ? (
                    <>
                      <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Memperbarui...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Simpan Perubahan Penulis
                    </>
                  )}
                </button>

                <Link
                  to="/admin/authors"
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition"
                >
                  Batal
                </Link>
              </div>
            </form>
          </div>

          {/* Live Preview Card */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Pratinjau Hasil Perubahan
              </span>
              <h3 className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Kartu profil pengarang terupdate:
              </h3>

              <div className="mt-4 p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow">
                    {getInitials(form.name)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {form.name || "Nama Penulis"}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>🌏</span> {form.nationality || "Indonesia"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {form.description || "Biografi singkat akan tampil di sini..."}
                  </p>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-800 dark:text-indigo-300 space-y-1">
                <p className="font-semibold">💡 Operasi Update (PUT):</p>
                <p>
                  Mengirimkan HTTP <code>PUT /api/authors/{id}</code> dengan data terbaru ke server backend menggunakan Axios.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
