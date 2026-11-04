import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header>
      <nav className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 dark:bg-gray-800 dark:border-gray-700 shadow-sm">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
              RB
            </div>
            <span className="self-center text-xl font-bold whitespace-nowrap text-gray-900 dark:text-white">
              Ruang Baca
            </span>
          </Link>

          <div className="flex items-center gap-2 lg:order-2">
            <Link
              to="/admin"
              className="inline-flex items-center text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900 font-semibold rounded-lg text-xs sm:text-sm px-3.5 py-2 transition border border-indigo-200 dark:border-indigo-800"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Panel Admin
            </Link>

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
