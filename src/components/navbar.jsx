import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
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
    <header>
      <nav className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 dark:bg-gray-800 dark:border-gray-700 shadow-sm transition-colors">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow group-hover:scale-105 transition-transform">
              RB
            </div>
            <span className="self-center text-xl font-bold whitespace-nowrap text-gray-900 dark:text-white">
              Ruang Baca
            </span>
          </Link>

          {/* Right Action / Auth Buttons */}
          <div className="flex items-center gap-2 lg:order-2">
            
            {/* Tombol Panel Admin */}
            <Link
              to="/admin"
              className={`inline-flex items-center font-semibold rounded-lg text-xs sm:text-sm px-3 py-2 transition border ${
                isAdmin
                  ? "text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900 border-indigo-200 dark:border-indigo-800"
                  : "text-slate-600 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              }`}
              title={isAdmin ? "Buka Panel Admin" : "Akses Terbatas: Hanya untuk Admin"}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Panel Admin</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Link Profil Pengguna */}
                <Link
                  to="/user/profile"
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {getInitials(user?.name)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[120px] truncate leading-tight">
                      {user?.name}
                    </span>
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                      isAdmin
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
                    }`}>
                      {role}
                    </span>
                  </div>
                </Link>

                {/* Tombol Logout */}
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-2 sm:px-2.5 sm:py-1.5 rounded-lg font-semibold transition border border-transparent hover:border-rose-200 dark:hover:border-rose-900 cursor-pointer"
                  title="Keluar Akun"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 font-medium rounded-lg text-xs sm:text-sm px-3 py-2 dark:hover:bg-gray-700 transition"
                >
                  Masuk
                </Link>

                <Link
                  to="/register"
                  className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-xs sm:text-sm px-3.5 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition shadow-sm"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0 text-sm">
              <li>
                <Link
                  to="/"
                  className="block py-2 pr-4 pl-3 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/books"
                  className="block py-2 pr-4 pl-3 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white"
                >
                  Koleksi Buku
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/genres"
                  className="block py-2 pr-4 pl-3 text-indigo-600 font-semibold dark:text-indigo-400"
                >
                  Genre (Admin)
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/authors"
                  className="block py-2 pr-4 pl-3 text-indigo-600 font-semibold dark:text-indigo-400"
                >
                  Penulis (Admin)
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
