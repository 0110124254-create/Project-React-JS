import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getGenreById, updateGenre } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

/* ─── Lucide-style thin SVG icons ─── */
const IconArrowLeft = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);
const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);
const IconSpinner = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);
const IconTag = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
  </svg>
);
const IconInfo = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </svg>
);
const IconExternalLink = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);
const IconCheckCircle = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const IconXCircle = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const IconDot = () => (
  <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

export default function GenreEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({ name: "", description: "" });
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const getInitials = (name) => {
    if (!name) return "AR";
    return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  };

  useEffect(() => {
    async function loadGenre() {
      setInitialLoading(true);
      setError(null);
      try {
        const res = await getGenreById(id);
        if (res.data) {
          setForm({ name: res.data.name || "", description: res.data.description || "" });
        } else {
          setError(`Data genre dengan ID #${id} tidak ditemukan.`);
        }
      } catch (err) {
        console.error("Gagal memuat detail genre:", err);
        setError("Gagal memuat data genre untuk diedit.");
      } finally {
        setInitialLoading(false);
      }
    }
    loadGenre();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Nama genre wajib diisi."); return; }
    setSubmitting(true);
    setError(null);
    try {
      const res = await updateGenre(id, {
        name: form.name.trim(),
        description: form.description.trim() || null,
      });
      setSuccess({ message: `Genre "${res.data.name}" berhasil diperbarui!`, source: res.source });
      setTimeout(() => navigate("/admin/genres"), 1400);
    } catch (err) {
      console.error("Gagal memperbarui genre:", err);
      setError(err.response?.data?.message || "Terjadi kesalahan saat memperbarui genre.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      {/* ── Top Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-slate-200 flex items-center px-4 md:pl-72 shadow-[0_1px_0_0_rgb(226_232_240)]">
        {/* Logo area (visible on mobile) */}
        <Link to="/admin" className="flex items-center gap-2 mr-4 md:hidden">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs tracking-tight shadow">
            RB
          </div>
        </Link>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
          <Link to="/admin" className="text-slate-400 hover:text-slate-700 transition font-medium hidden sm:block">
            Dashboard
          </Link>
          <IconDot />
          <Link to="/admin/genres" className="text-slate-400 hover:text-slate-700 transition font-medium hidden sm:block">
            Genre
          </Link>
          <IconDot />
          <span className="text-slate-800 font-semibold truncate">Edit Genre #{id}</span>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 px-2.5 py-1.5 rounded-lg transition bg-white hover:bg-slate-50"
          >
            <IconExternalLink />
            Web Publik
          </Link>

          <div className="flex items-center gap-2 pl-2.5 ml-0.5 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-[11px] shadow-sm ring-2 ring-white">
              {getInitials(user?.name || "Aulya Reski")}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-xs font-semibold text-slate-800">{user?.name || "Aulya Reski"}</span>
              <span className="text-[10px] font-medium text-indigo-600 uppercase tracking-wide">Administrator</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Sidebar ── */}
      <aside className="fixed top-0 left-0 z-40 w-64 h-full bg-white border-r border-slate-200 hidden md:flex flex-col pt-0">
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-slate-200 shrink-0">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white font-black text-sm tracking-tight shadow-md">
              RB
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-slate-900 tracking-tight">Ruang Baca</div>
              <div className="text-[10px] font-semibold text-indigo-600 uppercase tracking-widest">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          {/* Menu Utama */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Menu Utama
            </p>
            <ul className="space-y-0.5">
              <li>
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition group"
                >
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Master Data */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Master Data (CRUD)
            </p>
            <ul className="space-y-0.5">
              {/* Data Genre — AKTIF */}
              <li>
                <Link
                  to="/admin/genres"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 transition"
                >
                  <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3ZM6 6h.008v.008H6V6Z" />
                  </svg>
                  <span className="flex-1 truncate">Data Genre</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold tracking-wide border border-indigo-200">
                    CRUD
                  </span>
                </Link>
              </li>

              {/* Data Penulis */}
              <li>
                <Link
                  to="/admin/authors"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition group"
                >
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                  <span className="flex-1 truncate">Data Penulis</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold tracking-wide border border-emerald-200">
                    CRUD
                  </span>
                </Link>
              </li>

              {/* Koleksi Buku */}
              <li>
                <Link
                  to="/admin/books"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition group"
                >
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span className="flex-1 truncate">Koleksi Buku</span>
                </Link>
              </li>

              {/* Transaksi */}
              <li>
                <Link
                  to="/admin/transactions"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition group"
                >
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  <span className="flex-1 truncate">Transaksi</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Sidebar footer — task card */}
        <div className="shrink-0 px-3 pb-4 pt-3 border-t border-slate-100">
          <div className="rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-200 p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Tugas 4</span>
            </div>
            <p className="text-xs font-semibold text-slate-700 leading-snug">
              React JS Lanjutan
            </p>
            <p className="text-[11px] text-slate-500 leading-snug">
              Routing & Hak Akses Pengguna (RBAC)
            </p>
            <div className="pt-1 flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-[8px]">
                AR
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Aulya Reski · STTNF</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="md:ml-64 pt-14 min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-7">

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-1">
              {/* breadcrumb (mobile) */}
              <nav className="flex items-center gap-1.5 text-xs text-slate-400 sm:hidden mb-1">
                <Link to="/admin" className="hover:text-slate-600 transition">Dashboard</Link>
                <IconDot />
                <Link to="/admin/genres" className="hover:text-slate-600 transition">Genre</Link>
                <IconDot />
                <span className="text-slate-600 font-medium">Edit #{id}</span>
              </nav>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-200/60">
                  <IconTag />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                    Edit & Perbarui Data Genre
                  </h1>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Perbarui rincian kategori buku&nbsp;
                    <span className="font-mono text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                      PUT /api/genres/{id}
                    </span>
                    &nbsp;via Axios
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/admin/genres"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg shadow-sm transition shrink-0"
            >
              <IconArrowLeft />
              Kembali
            </Link>
          </div>

          {/* Alert: Success */}
          {success && (
            <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm">
              <div className="text-emerald-600 mt-0.5 shrink-0">
                <IconCheckCircle />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-emerald-800">{success.message}</p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Tersimpan via:{" "}
                  <span className="font-semibold">
                    {success.source === "api" ? "REST API Laravel (HTTP PUT)" : "Penyimpanan Lokal"}
                  </span>
                  {" "}· Mengarahkan ke daftar genre&hellip;
                </p>
              </div>
              <Link
                to="/admin/genres"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 shrink-0"
              >
                Lihat →
              </Link>
            </div>
          )}

          {/* Alert: Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
              <div className="text-red-500 mt-0.5 shrink-0">
                <IconXCircle />
              </div>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Loading skeleton */}
          {initialLoading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center gap-4 shadow-sm">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-slate-700">Memuat data genre&hellip;</p>
                <p className="text-xs text-slate-400">Mengambil informasi genre #{id} dari server</p>
              </div>
            </div>
          ) : (
            /* ── 2-Column Layout ── */
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

              {/* ── Kolom Kiri: Form (65%) ── */}
              <div className="lg:col-span-3">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  {/* Card Header */}
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      <IconTag />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-slate-800">Formulir Edit Genre</h2>
                      <p className="text-xs text-slate-400 mt-0.5">ID: <span className="font-mono font-semibold text-slate-600">#{id}</span></p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">

                    {/* Nama Genre */}
                    <div className="space-y-2">
                      <label htmlFor="genre-name" className="block text-sm font-semibold text-slate-700">
                        Nama Genre{" "}
                        <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="genre-name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Misal: Fiksi Ilmiah, Fantasi, Psikologi"
                          className="w-full px-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
                          required
                        />
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <IconInfo />
                        Nama kategori buku yang akan diperbarui di katalog sistem.
                      </p>
                    </div>

                    {/* Deskripsi Genre */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="genre-description" className="block text-sm font-semibold text-slate-700">
                          Deskripsi Genre
                        </label>
                        <span className="text-[11px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          Opsional
                        </span>
                      </div>
                      <textarea
                        id="genre-description"
                        name="description"
                        rows="4"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Jelaskan karakteristik, topik umum, atau tema yang dicakup genre ini…"
                        className="w-full px-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all resize-none leading-relaxed"
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                          <IconInfo />
                          Deskripsi singkat tentang tipe buku dalam kategori ini.
                        </p>
                        <span className="text-xs text-slate-400 font-mono tabular-nums">
                          {form.description.length} karakter
                        </span>
                      </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex items-center gap-3 pt-5 mt-2 border-t border-slate-100">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {submitting ? (
                          <>
                            <IconSpinner />
                            Memperbarui&hellip;
                          </>
                        ) : (
                          <>
                            <IconCheck />
                            Simpan Perubahan (Update)
                          </>
                        )}
                      </button>
                      <Link
                        to="/admin/genres"
                        className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all"
                      >
                        Batal
                      </Link>
                    </div>
                  </form>
                </div>
              </div>

              {/* ── Kolom Kanan: Preview & Info (35%) ── */}
              <div className="lg:col-span-2 space-y-4">

                {/* Live Preview Card */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                      Pratinjau Hasil Perubahan
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <div className="p-5 space-y-5">
                    <p className="text-xs text-slate-400">Tampilan badge & info genre saat disimpan:</p>

                    <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 space-y-4">
                      {/* Badge preview */}
                      <div>
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                          Badge Kategori
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          {form.name || (
                            <span className="text-slate-400 italic">Nama Genre</span>
                          )}
                        </span>
                      </div>

                      {/* ID */}
                      <div>
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                          ID Genre
                        </span>
                        <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                          #{id}
                        </span>
                      </div>

                      {/* Deskripsi */}
                      <div>
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                          Deskripsi
                        </span>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {form.description || (
                            <span className="text-slate-400 italic">Belum ada deskripsi</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Info Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5 space-y-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600">
                      <IconInfo />
                    </div>
                    <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
                      Operasi Update (PUT)
                    </span>
                  </div>
                  <div className="space-y-2.5 text-xs text-indigo-700 leading-relaxed">
                    <p>
                      Mengirimkan HTTP{" "}
                      <span className="font-mono font-bold bg-indigo-100 px-1.5 py-0.5 rounded border border-indigo-200 text-indigo-800">
                        PUT /api/genres/{id}
                      </span>{" "}
                      menggunakan <strong>Axios</strong> dan memperbarui state secara reaktif.
                    </p>
                    <div className="rounded-lg bg-white/60 border border-indigo-100 p-3 font-mono text-[11px] text-indigo-800 space-y-0.5 leading-5">
                      <p><span className="text-violet-600">await</span> updateGenre(id, {"{"}</p>
                      <p>&nbsp;&nbsp;name: form.name,</p>
                      <p>&nbsp;&nbsp;description: form.description</p>
                      <p>{"}"});</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
