import { createContext, useContext, useState, useEffect } from "react";
import { loginUser as apiLoginUser, registerUser as apiRegisterUser, logoutUser as apiLogoutUser } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inisialisasi status autentikasi dari localStorage saat aplikasi pertama kali dimuat
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const isAdmin = Boolean(parsedUser.is_admin || parsedUser.role === "admin");
        setUser({
          ...parsedUser,
          role: isAdmin ? "admin" : "user",
          is_admin: isAdmin,
        });
        setToken(storedToken);
      }
    } catch (e) {
      console.error("Gagal memuat sesi autentikasi dari penyimpanan lokal:", e);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login handler
  const login = async (credentials) => {
    const result = await apiLoginUser(credentials);
    const loggedUser = result.data.user;
    const userToken = result.data.token;

    const isAdmin = Boolean(loggedUser.is_admin || loggedUser.role === "admin");
    const normalizedUser = {
      ...loggedUser,
      role: isAdmin ? "admin" : "user",
      is_admin: isAdmin,
    };

    setUser(normalizedUser);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", userToken);

    return normalizedUser;
  };

  // Register handler
  const register = async (userData) => {
    const result = await apiRegisterUser(userData);
    return result;
  };

  // Logout handler
  const logout = async () => {
    try {
      await apiLogoutUser();
    } catch (e) {
      console.warn("Logout error:", e);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  // Demo Switch Role: Memudahkan mentor/penguji beralih peran dalam 1 klik
  const switchDemoRole = async (targetRole = "admin") => {
    if (targetRole === "admin") {
      return await login({
        email: "admin@ruangbaca.com",
        password: "password123",
      });
    } else {
      return await login({
        email: "user@ruangbaca.com",
        password: "password123",
      });
    }
  };

  // Status turunan peran pengguna
  const isAuthenticated = Boolean(user && token);
  const isAdmin = Boolean(isAuthenticated && (user?.is_admin === true || user?.role === "admin"));
  const role = isAuthenticated ? (isAdmin ? "admin" : "user") : "guest";

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    role,
    login,
    register,
    logout,
    switchDemoRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam komponen <AuthProvider>");
  }
  return context;
}

