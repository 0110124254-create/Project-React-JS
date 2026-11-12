import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserProfile() {
  const { user, role, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const [switching, setSwitching] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSwitchToAdmin = async () => {
    setSwitching(true);
    try {
      await switchDemoRole("admin");
      navigate("/admin");
    } finally {
      setSwitching(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 gap-1.5 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
            <span>🛡️</span>
            <span>Tugas 4: Role-Based Protected Route</span>
          </div>
        </div>

        {/* User Identity Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-18 h-18 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-600/30 shrink-0">
              {getInitials(user?.name)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {user?.name || "Pengguna Ruang Baca"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Role: {role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
                @{user?.username || "username"} · {user?.email || "email@domain.com"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Status Keanggotaan: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Aktif (Verified Member)</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto relative z-10">
            <button
              onClick={handleSwitchToAdmin}
              disabled={switching}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>Ganti Akun ke Admin</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Section: Pengujian Otorisasi & Hak Akses (Tugas 4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Box 1: Hak Akses Pengguna Biasa */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Halaman yang Boleh Diakses
                </h3>
                <p className="text-xs text-slate-500">Izin hak akses untuk peran pengguna biasa (User)</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span>Halaman Beranda & Katalog Buku</span>
                <Link to="/books" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                  Buka →
                </Link>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span>Detail Buku & Ulasan</span>
                <Link to="/books/1" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                  Buka →
                </Link>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span>Halaman Profil Pribadi (Protected)</span>
                <span className="text-emerald-600 font-bold">Sedang Aktif</span>
              </li>
            </ul>
          </div>

          {/* Box 2: Halaman Terbatas Administrator (Protected) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                ⛔
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Area Khusus Administrator
                </h3>
                <p className="text-xs text-slate-500">Diproteksi oleh &lt;ProtectedRoute allowedRoles={['admin']} /&gt;</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Karena Anda sedang masuk sebagai <strong className="text-amber-600">User</strong>, rute-rute administratif seperti Dashboard Admin, CRUD Genre, dan CRUD Penulis secara otomatis diblokir oleh sistem otorisasi frontend:
            </p>

            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-rose-800 dark:text-rose-300">
                <span>Uji Penolakan Akses (Role Gate):</span>
                <span className="font-mono text-[11px] bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded">
                  403 Forbidden
                </span>
              </div>
              <p className="text-[11px] text-rose-700 dark:text-rose-400">
                Klik tombol di bawah ini untuk mencoba membuka halaman <code>/admin</code>. Sistem akan mencegat Anda dan mengarahkan ke halaman <strong>403 Akses Ditolak</strong>:
              </p>
              <Link
                to="/admin"
                className="w-full py-2 px-3 rounded-lg text-white font-bold text-xs bg-rose-600 hover:bg-rose-700 transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Coba Akses /admin (Harus Ditolak)</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Member Reading Stats Mockup */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📚</span> Aktivitas Membaca Pengguna
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400">Buku Sedang Dibaca</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">3</p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400">Koleksi Disimpan</span>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">12</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400">Selesai Dibaca</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">28</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

