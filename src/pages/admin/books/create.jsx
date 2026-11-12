import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const GENRES = ["Fiksi", "Nonfiksi", "Fiksi Sejarah", "Sains", "Teknologi", "Pengembangan Diri", "Biografi", "Sejarah", "Psikologi", "Lainnya"];

export default function BookCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    price: "",
    stock: "",
    isbn: "",
    published: "",
    description: "",
    cover: "",
  });
  const [coverErr, setCoverErr] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (name === "cover") setCoverErr(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulasi simpan ke localStorage
    await new Promise(r => setTimeout(r, 800));
    const books = JSON.parse(localStorage.getItem("app_books") || "[]");
    const newBook = { ...form, id: Date.now(), price: Number(form.price), stock: Number(form.stock), created_at: new Date().toISOString() };
    localStorage.setItem("app_books", JSON.stringify([newBook, ...books]));
    setSubmitting(false);
    navigate("/admin/books");
  };

  const previewSrc = !coverErr && form.cover ? form.cover : null;
  const initials = form.title ? form.title.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() : "RB";

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Tambah Buku Baru</h1>
            <p className="text-sm text-slate-500">Isi detail koleksi buku yang ingin ditambahkan</p>
          </div>
        </div>
        <Link
          to="/admin/books"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Kembali
        </Link>
      </div>

      {/* ── 2-Column Form ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        {/* Kolom Kiri: Form */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="text-sm font-semibold text-slate-800">Informasi Buku</span>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            {/* Judul Buku */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Judul Buku <span className="text-red-500">*</span>
              </label>
              <input
                type="text" name="title" value={form.title} onChange={handleChange} required
                placeholder="Contoh: Laskar Pelangi"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition placeholder:text-slate-400"
              />
            </div>

            {/* Penulis & Genre */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Penulis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="author" value={form.author} onChange={handleChange} required
                  placeholder="Contoh: Andrea Hirata"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Genre <span className="text-red-500">*</span>
                </label>
                <select
                  name="genre" value={form.genre} onChange={handleChange} required
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition text-slate-700"
                >
                  <option value="">Pilih genre...</option>
                  {GENRES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>

            {/* Harga & Stok & Tahun */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Harga (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number" name="price" value={form.price} onChange={handleChange} required min="0"
                  placeholder="89000"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Stok <span className="text-red-500">*</span>
                </label>
                <input
                  type="number" name="stock" value={form.stock} onChange={handleChange} required min="0"
                  placeholder="50"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Tahun Terbit</label>
                <input
                  type="number" name="published" value={form.published} onChange={handleChange} min="1900" max="2099"
                  placeholder="2024"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* ISBN */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">ISBN</label>
              <input
                type="text" name="isbn" value={form.isbn} onChange={handleChange}
                placeholder="978-xxx-xxx-xxx-x"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition placeholder:text-slate-400 font-mono"
              />
            </div>

            {/* URL Cover */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">URL Foto Cover Buku</label>
                <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">Opsional</span>
              </div>
              <input
                type="url" name="cover" value={form.cover} onChange={handleChange}
                placeholder="https://covers.openlibrary.org/b/id/..."
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition placeholder:text-slate-400 font-mono"
              />
              <p className="text-xs text-slate-400">Gunakan URL gambar dari Open Library, Google Books, atau link gambar lainnya.</p>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Sinopsis / Deskripsi</label>
                <span className="text-xs text-slate-400 font-mono tabular-nums">{form.description.length} karakter</span>
              </div>
              <textarea
                name="description" value={form.description} onChange={handleChange} rows="4"
                placeholder="Tulis sinopsis atau deskripsi singkat tentang buku ini..."
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition placeholder:text-slate-400 resize-none leading-relaxed"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit" disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 disabled:opacity-50 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Simpan Buku
                  </>
                )}
              </button>
              <Link
                to="/admin/books"
                className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Batal
              </Link>
            </div>
          </form>
        </div>

        {/* Kolom Kanan: Preview Cover */}
        <div className="lg:col-span-2 space-y-4">
          {/* Cover Preview */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Pratinjau Cover</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <div className="p-5 flex flex-col items-center gap-4">
              {/* Cover */}
              <div className="w-36 aspect-[2/3] rounded-xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100 relative">
                {previewSrc ? (
                  <img
                    src={previewSrc}
                    alt="Preview cover"
                    className="w-full h-full object-cover"
                    onError={() => setCoverErr(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-400 to-violet-600 text-white">
                    <span className="text-3xl font-black">{initials}</span>
                    <span className="text-[10px] mt-1 opacity-70 tracking-wider">BUKU</span>
                  </div>
                )}
              </div>

              {/* Book Meta Preview */}
              <div className="text-center space-y-1 w-full">
                <p className="text-sm font-bold text-slate-800 leading-snug">
                  {form.title || <span className="text-slate-300 italic">Judul Buku</span>}
                </p>
                <p className="text-xs text-slate-400">
                  {form.author || <span className="italic">Nama Penulis</span>}
                </p>
                {form.genre && (
                  <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                    {form.genre}
                  </span>
                )}
                {form.price && (
                  <p className="text-sm font-bold text-slate-900">
                    Rp {Number(form.price).toLocaleString("id-ID")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Tips Cover Buku</span>
            </div>
            <ul className="space-y-2 text-xs text-indigo-700 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
                Gunakan URL dari <strong>Open Library</strong>: <span className="font-mono bg-white/60 px-1 rounded">covers.openlibrary.org</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
                Ukuran cover ideal: <strong>rasio 2:3</strong> (portrait)
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
                Jika URL kosong, inisial judul akan ditampilkan otomatis
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
