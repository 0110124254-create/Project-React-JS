import { useState } from "react";
import { Link } from "react-router-dom";

/* ── Data Buku dengan Cover dari Open Library / Google Books ── */
const SAMPLE_BOOKS = [
  {
    id: 1,
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    genre: "Fiksi",
    price: 89000,
    stock: 42,
    cover: "https://covers.openlibrary.org/b/id/8231856-M.jpg",
    published: "2005",
    isbn: "978-979-1261-47-7",
  },
  {
    id: 2,
    title: "Bumi Manusia",
    author: "Pramoedya Ananta Toer",
    genre: "Fiksi Sejarah",
    price: 125000,
    stock: 18,
    cover: "https://covers.openlibrary.org/b/id/9255266-M.jpg",
    published: "1980",
    isbn: "978-979-407-313-7",
  },
  {
    id: 3,
    title: "Filosofi Teras",
    author: "Henry Manampiring",
    genre: "Nonfiksi",
    price: 98000,
    stock: 65,
    cover: "https://covers.openlibrary.org/b/id/10716725-M.jpg",
    published: "2018",
    isbn: "978-602-03-7845-5",
  },
  {
    id: 4,
    title: "Laut Bercerita",
    author: "Leila S. Chudori",
    genre: "Fiksi",
    price: 115000,
    stock: 27,
    cover: "https://covers.openlibrary.org/b/id/9918438-M.jpg",
    published: "2017",
    isbn: "978-602-424-694-3",
  },
  {
    id: 5,
    title: "Pulang",
    author: "Tere Liye",
    genre: "Fiksi",
    price: 79000,
    stock: 0,
    cover: "https://covers.openlibrary.org/b/id/8408734-M.jpg",
    published: "2015",
    isbn: "978-602-291-068-8",
  },
  {
    id: 6,
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Pengembangan Diri",
    price: 135000,
    stock: 33,
    cover: "https://covers.openlibrary.org/b/id/10309258-M.jpg",
    published: "2018",
    isbn: "978-0-7352-1129-2",
  },
];

const genreColors = {
  "Fiksi": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Fiksi Sejarah": "bg-violet-50 text-violet-700 border-violet-200",
  "Nonfiksi": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Pengembangan Diri": "bg-amber-50 text-amber-700 border-amber-200",
};

function BookCover({ src, title }) {
  const [err, setErr] = useState(false);
  const initials = title.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const colors = ["from-indigo-400 to-violet-500", "from-emerald-400 to-teal-500", "from-amber-400 to-orange-500", "from-rose-400 to-pink-500"];
  const color = colors[title.charCodeAt(0) % colors.length];

  if (err || !src) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${color} text-white rounded-lg`}>
        <span className="text-2xl font-black tracking-tight">{initials}</span>
        <span className="text-[9px] mt-1 opacity-70 font-medium">BUKU</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={title}
      className="w-full h-full object-cover rounded-lg"
      onError={() => setErr(true)}
    />
  );
}

export default function AdminBooks() {
  const [books, setBooks] = useState(SAMPLE_BOOKS);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.genre.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    setDeleteId(null);
  };

  const formatPrice = (p) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p);

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Koleksi Buku</h1>
            <p className="text-sm text-slate-500">{books.length} judul buku tersedia</p>
          </div>
        </div>
        <Link
          to="/admin/books/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Tambah Buku
        </Link>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Judul", value: books.length, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
          { label: "Tersedia", value: books.filter(b => b.stock > 0).length, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { label: "Stok Habis", value: books.filter(b => b.stock === 0).length, color: "text-red-500", bg: "bg-red-50 border-red-100" },
          { label: "Total Stok", value: books.reduce((a, b) => a + b.stock, 0), color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border rounded-xl px-4 py-3 space-y-0.5`}>
            <p className="text-xs font-medium text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} tabular-nums`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari judul, penulis, atau genre..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition"
            />
          </div>
          <span className="text-xs text-slate-400 shrink-0">
            {filtered.length} hasil
          </span>
        </div>

        {/* ── Book Grid ── */}
        {filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
            <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            <p className="text-sm font-medium">Buku tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-0 divide-x divide-y divide-slate-100">
            {filtered.map((book) => (
              <div key={book.id} className="p-4 hover:bg-slate-50/70 transition group relative">
                {/* Cover */}
                <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md border border-slate-100 mb-3 bg-slate-100">
                  <BookCover src={book.cover} title={book.title} />
                  {/* Stock badge */}
                  {book.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Habis</span>
                    </div>
                  )}
                  {/* Action overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Link
                      to={`/admin/books/${book.id}/edit`}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow text-indigo-600 hover:bg-indigo-50 transition"
                      title="Edit"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => setDeleteId(book.id)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow text-red-500 hover:bg-red-50 transition"
                      title="Hapus"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-800 leading-tight line-clamp-2 group-hover:text-indigo-600 transition">
                    {book.title}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{book.author}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${genreColors[book.genre] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      {book.genre}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700 tabular-nums">
                      {formatPrice(book.price)}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Stok: <span className={`font-semibold ${book.stock === 0 ? "text-red-500" : "text-emerald-600"}`}>{book.stock}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Menampilkan <span className="font-semibold text-slate-700">{filtered.length}</span> dari{" "}
              <span className="font-semibold text-slate-700">{books.length}</span> buku
            </span>
            <span className="text-[10px] text-slate-300 font-mono">Koleksi Buku · Ruang Baca Admin</span>
          </div>
        )}
      </div>

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Hapus Buku?</h3>
              <p className="text-sm text-slate-500">
                "{books.find(b => b.id === deleteId)?.title}" akan dihapus secara permanen.
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition shadow-sm"
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
