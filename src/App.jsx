import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// Auth Context Provider
import { AuthProvider } from "./context/AuthContext";

// Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

// Layouts
import PublicLayout from "./layouts/public";
import AdminLayout from "./layouts/admin";

// Public Pages
import Home from "./pages/public/index";
import Books from "./pages/public/books/index";
import ShowBook from "./pages/public/books/show";

// Auth & Access Control Pages
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Unauthorized from "./pages/auth/unauthorized";

// User Protected Pages
import UserProfile from "./pages/user/profile";

// Admin Protected Pages (CRUD & Management)
import Dashboard from "./pages/admin/index";
import AdminBooks from "./pages/admin/books/index";
import BookCreate from "./pages/admin/books/create";
import AdminGenres from "./pages/admin/genres/index";
import GenreCreate from "./pages/admin/genres/create";
import GenreEdit from "./pages/admin/genres/edit";
import AdminAuthors from "./pages/admin/authors/index";
import AuthorCreate from "./pages/admin/authors/create";
import AuthorEdit from "./pages/admin/authors/edit";
import AdminTransactions from "./pages/admin/transactions/index";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-2xl">
          404
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Maaf, halaman yang Anda cari tidak tersedia atau sedang dalam pembaruan.
        </p>
        <div className="pt-2 flex justify-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            Ke Beranda
          </Link>
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 transition"
          >
            Panel Admin
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ========================================= */}
          {/* 1. PUBLIC WEBSITE ROUTES (Bebas Diakses) */}
          {/* ========================================= */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:id" element={<ShowBook />} />
          </Route>

          {/* ========================================= */}
          {/* 2. GUEST ROUTES (Khusus Belum Login)     */}
          {/* ========================================= */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* ========================================= */}
          {/* 3. USER PROTECTED ROUTES (User & Admin)   */}
          {/* ========================================= */}
          <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
            <Route path="/user/profile" element={<UserProfile />} />
          </Route>

          {/* ========================================= */}
          {/* 4. ADMIN PROTECTED ROUTES (Khusus Admin)  */}
          {/* ========================================= */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              
              {/* Genre Management */}
              <Route path="genres" element={<AdminGenres />} />
              <Route path="genres/create" element={<GenreCreate />} />
              <Route path="genres/edit/:id" element={<GenreEdit />} />
              
              {/* Author Management */}
              <Route path="authors" element={<AdminAuthors />} />
              <Route path="authors/create" element={<AuthorCreate />} />
              <Route path="authors/edit/:id" element={<AuthorEdit />} />
              
              {/* Book Management */}
              <Route path="books" element={<AdminBooks />} />
              <Route path="books/create" element={<BookCreate />} />
              
              {/* Transaction Management */}
              <Route path="transactions" element={<AdminTransactions />} />
            </Route>
          </Route>

          {/* ========================================= */}
          {/* 5. HALAMAN 403 FORBIDDEN & 404 NOT FOUND  */}
          {/* ========================================= */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
