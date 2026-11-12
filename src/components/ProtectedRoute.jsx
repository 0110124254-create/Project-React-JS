import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Komponen Protected Route (Role-Based Access Control)
 * Membatasi akses rute berdasarkan status autentikasi dan peran (roles).
 * 
 * @param {Array<string>} allowedRoles - Daftar peran yang diizinkan (misal: ['admin'] atau ['admin', 'user'])
 */
export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  // Tampilkan layar loading saat memeriksa sesi pengguna
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Memverifikasi hak akses pengguna...
          </p>
        </div>
      </div>
    );
  }

  // 1. Jika belum login sama sekali, arahkan ke halaman /login dengan menyimpan lokasi asal
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
          message: "Silakan masuk terlebih dahulu untuk mengakses halaman ini.",
        }}
        replace
      />
    );
  }

  // 2. Jika sudah login tetapi perannya tidak sesuai (misal: user biasa ingin buka /admin)
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          attemptedPath: location.pathname,
          userRole: role,
          userName: user?.name,
          requiredRoles: allowedRoles,
        }}
        replace
      />
    );
  }

  // 3. Hak akses valid, render komponen anak / rute yang diminta
  return <Outlet />;
}

