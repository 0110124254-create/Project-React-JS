import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center p-2.5 text-sm font-medium rounded-lg transition duration-75 group ${
      isActive
        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-semibold"
        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
    }`;

  return (
    <div className="antialiased bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50 shadow-sm">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex justify-start items-center">
            <button
              data-drawer-target="drawer-navigation"
              data-drawer-toggle="drawer-navigation"
              aria-controls="drawer-navigation"
              className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Toggle sidebar</span>
            </button>
            <Link
              to="/admin"
              className="flex items-center justify-between mr-4"
            >
              <div className="mr-3 w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
                RB
              </div>
              <span className="self-center text-xl font-bold whitespace-nowrap text-gray-900 dark:text-white">
                Ruang Baca <span className="text-xs px-2 py-0.5 ml-1 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-semibold">Admin</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:order-2">
            <Link
              to="/"
              className="text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition"
              title="Kunjungi website publik"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Web Publik</span>
            </Link>

            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {getInitials(user?.name)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">
                  {user?.name || "Administrator"}
                </div>
                <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase">
                  Role: Administrator
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-1 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 p-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold transition"
                title="Keluar dari Admin"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <aside
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidenav"
        id="drawer-navigation"
      >
        <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Menu Utama
              </p>
              <ul className="space-y-1">
                <li>
                  <NavLink to="/admin" end className={navItemClass}>
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 mr-3 text-gray-400 group-hover:text-indigo-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span>Dashboard</span>
                  </NavLink>
                </li>
              </ul>
            </div>

            <div>
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Master Data (CRUD)
              </p>
              <ul className="space-y-1">
                <li>
                  <NavLink to="/admin/genres" className={navItemClass}>
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 mr-3 text-gray-400 group-hover:text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <span className="flex-1">Data Genre</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 font-semibold">
                      CRUD
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/authors" className={navItemClass}>
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 mr-3 text-gray-400 group-hover:text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="flex-1">Data Penulis</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 font-semibold">
                      CRUD
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/books" className={navItemClass}>
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 mr-3 text-gray-400 group-hover:text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <span>Koleksi Buku</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/transactions" className={navItemClass}>
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 mr-3 text-gray-400 group-hover:text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <span>Transaksi</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="p-3 bg-gray-50 dark:bg-gray-750 rounded-xl text-xs space-y-1 text-gray-500 dark:text-gray-400">
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                Tugas 4 React JS Lanjutan
              </p>
              <p>Routing &amp; Hak Akses Pengguna (RBAC)</p>
              <p className="text-[11px] text-gray-400">Aulya Reski · STTNF</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="p-4 md:ml-64 min-h-screen pt-20 pb-12">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
