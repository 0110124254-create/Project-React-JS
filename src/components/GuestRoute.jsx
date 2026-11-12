import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Komponen Guest Route
 * Mencegah pengguna yang sudah login mengakses kembali halaman /login dan /register.
 * Mengarahkan otomatis ke dashboard admin (jika admin) atau profil pengguna (jika user biasa).
 */
export default function GuestRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/user/profile"} replace />;
  }

  return <Outlet />;
}

