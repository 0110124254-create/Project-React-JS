import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Unauthorized() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout, switchDemoRole } = useAuth();

  const attemptedPath = location.state?.attemptedPath || "/admin";
  const requiredRoles = location.state?.requiredRoles || ["admin"];

  const handleSwitchToAdmin = async () => {
    try {
      await switchDemoRole("admin");
      navigate("/admin");
    } catch (e) {
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 text-center relative overflow-hidden">
        
        {/* Ornamen Latar Belakang */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Ikon Gembok 403 */}
        <div className="w-20 h-20 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-5 ring-8 ring-rose-50 dark:ring-rose-950/30">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        {/* Badge Kode Error */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-2 border border-rose-200 dark:border-rose-900">
          <span>⛔</span> 403 Forbidden · Hak Akses Terbatas
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          Akses Ditolak
        </h1>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          Maaf, halaman <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 font-mono text-xs">{attemptedPath}</code> hanya dapat diakses oleh pengguna dengan hak akses <strong>{requiredRoles.join(", ").toUpperCase()}</strong>.
        </p>

        {/* Kartu Status Peran Pengguna Saat Ini */}
        <div className="my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left space-y-2.5 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Akun Aktif:</span>
            <span className="font-bold text-slate-900 dark:text-white">{user?.name || "Pengguna Terdaftar"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Peran Saat Ini:</span>
            <span className="px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {role} (Pengguna Biasa)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Batasan Hak Akses:</span>
            <span className="text-slate-600 dark:text-slate-400">Hanya dapat melihat katalog dan profil</span>
          </div>
        </div>

        {/* Tombol Aksi Navigasi */}
        <div className="space-y-2.5">
          <Link
            to="/user/profile"
            className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Buka Dashboard Profil Pengguna</span>
          </Link>

          <button
            onClick={handleSwitchToAdmin}
            className="w-full py-2.5 px-4 rounded-xl text-indigo-700 dark:text-indigo-300 font-semibold text-sm bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span>Ganti Akun ke Administrator (Uji Akses)</span>
          </button>

          <div className="flex gap-2 pt-2">
            <Link
              to="/"
              className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-center border border-slate-200 dark:border-slate-700"
            >
              Kembali ke Beranda
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-center border border-rose-200 dark:border-rose-900 cursor-pointer"
            >
              Keluar Akun
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

