import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/api";

export default function Register() {
  const navigate = useNavigate();

  // State nilai form input
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    agreeTerms: false,
  });

  // State error validasi per field
  const [errors, setErrors] = useState({});

  // State interaksi (field yang pernah disentuh/fokus)
  const [touched, setTouched] = useState({});

  // State UI
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successData, setSuccessData] = useState(null);
  const [countdown, setCountdown] = useState(4);

  // Menghitung kekuatan kata sandi (Password Strength: 0 - 4)
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "Belum diisi", color: "bg-gray-200 dark:bg-gray-700", text: "text-gray-400" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Sangat Lemah", color: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" };
      case 2:
        return { score: 2, label: "Cukup", color: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" };
      case 3:
        return { score: 3, label: "Kuat", color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" };
      case 4:
        return { score: 4, label: "Sangat Kuat", color: "bg-indigo-600", text: "text-indigo-600 dark:text-indigo-400" };
      default:
        return { score: 1, label: "Lemah", color: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" };
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Fungsi validasi satu field tertentu
  const validateField = (name, value, allValues = formData) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Nama lengkap wajib diisi.";
        } else if (value.trim().length < 3) {
          error = "Nama lengkap minimal harus 3 karakter.";
        }
        break;

      case "username":
        if (!value.trim()) {
          error = "Username wajib diisi.";
        } else if (value.trim().length < 3) {
          error = "Username minimal harus 3 karakter.";
        } else if (!/^[a-zA-Z0-9_.-]+$/.test(value)) {
          error = "Username hanya boleh huruf, angka, titik, strip, atau garis bawah tanpa spasi.";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Alamat email wajib diisi.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Format alamat email tidak valid (contoh: pengguna@domain.com).";
        }
        break;

      case "password":
        if (!value) {
          error = "Kata sandi wajib diisi.";
        } else if (value.length < 6) {
          error = "Kata sandi minimal harus 6 karakter.";
        }
        break;

      case "password_confirmation":
        if (!value) {
          error = "Konfirmasi kata sandi wajib diisi.";
        } else if (value !== allValues.password) {
          error = "Konfirmasi kata sandi tidak cocok dengan kata sandi.";
        }
        break;

      case "agreeTerms":
        if (!value) {
          error = "Anda harus menyetujui Syarat dan Ketentuan layanan.";
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Handler input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    // Untuk username otomatis tanpa spasi dan huruf kecil
    const processedValue = name === "username" ? fieldValue.replace(/\s+/g, "").toLowerCase() : fieldValue;

    const newFormData = {
      ...formData,
      [name]: processedValue,
    };

    setFormData(newFormData);

    // Jika field sudah pernah disentuh, perbarui validasinya langsung
    if (touched[name]) {
      const fieldError = validateField(name, processedValue, newFormData);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }

    // Jika sedang mengubah password, sinkronkan error pada password_confirmation bila sudah disentuh
    if (name === "password" && touched.password_confirmation) {
      const confirmError = validateField("password_confirmation", newFormData.password_confirmation, newFormData);
      setErrors((prev) => ({
        ...prev,
        password_confirmation: confirmError,
      }));
    }
  };

  // Handler blur (ketika kursor meninggalkan input)
  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const fieldError = validateField(name, fieldValue, formData);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  // Validasi seluruh field form sebelum submit
  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key], formData);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      username: true,
      email: true,
      password: true,
      password_confirmation: true,
      agreeTerms: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  // Handler submit registrasi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const isValid = validateAll();
    if (!isValid) {
      setServerError("Mohon periksa dan lengkapi seluruh field sesuai instruksi.");
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser({
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });

      // Tampilkan state sukses
      setSuccessData(result.data.user);

      // Hitung mundur sebelum diarahkan ke halaman login
      let timer = 4;
      const interval = setInterval(() => {
        timer -= 1;
        setCountdown(timer);
        if (timer <= 0) {
          clearInterval(interval);
          navigate("/login", {
            state: {
              registeredEmail: formData.email,
              message: "Registrasi berhasil! Silakan masuk dengan akun baru Anda.",
            },
          });
        }
      }, 1000);
    } catch (err) {
      console.error("Gagal melakukan registrasi:", err);
      setServerError(
        err.message || "Terjadi kesalahan saat memproses registrasi. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  // Ambil inisial nama untuk avatar kartu keanggotaan
  const getInitials = (fullName) => {
    if (!fullName) return "RB";
    return fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* ======================================================== */}
        {/* SISI KIRI: PANEL BRANDING & LIVE MEMBERSHIP CARD PREVIEW */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 lg:pr-4">
          
          {/* Header & Logo */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 group mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                RB
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Ruang Baca
                </span>
                <span className="block text-xs font-semibold text-indigo-600 dark:text-indigo-400 -mt-1 tracking-wider uppercase">
                  Portal Literasi Digital
                </span>
              </div>
            </Link>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Bergabung Bersama <span className="text-indigo-600 dark:text-indigo-400">Ribuan Pembaca</span> Cerdas.
            </h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Daftar sekarang untuk membuka akses katalog ribuan buku pilihan, mencatat progres bacaan, serta menikmati rekomendasi bahan bacaan terbaik setiap hari.
            </p>
          </div>

          {/* ======================================================== */}
          {/* KREATIVITAS UI: LIVE PREVIEW KARTU ANGGOTA PERPUSTAKAAN */}
          {/* ======================================================== */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-2xl p-5 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden border border-indigo-400/30">
            {/* Background Ornamen */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-violet-400/20 rounded-full blur-lg pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between h-48">
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-200">
                    Kartu Anggota Digital
                  </span>
                  <h3 className="text-base font-bold tracking-tight">Ruang Baca Community</h3>
                </div>
                <div className="px-2.5 py-1 bg-white/15 backdrop-blur-md rounded-full text-[11px] font-semibold tracking-wide border border-white/20">
                  {formData.agreeTerms ? "Terverifikasi" : "Calon Anggota"}
                </div>
              </div>

              {/* Card Body - Live Data */}
              <div className="flex items-center gap-3.5 my-2">
                <div className="w-13 h-13 w-12 h-12 rounded-xl bg-white text-indigo-700 flex items-center justify-center font-black text-lg shadow-inner shrink-0">
                  {getInitials(formData.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-bold truncate">
                    {formData.name.trim() || "Nama Lengkap Anda"}
                  </h4>
                  <p className="text-xs text-indigo-200 font-mono truncate">
                    @{formData.username.trim() || "username"}
                  </p>
                  <p className="text-[11px] text-indigo-200/80 truncate">
                    {formData.email.trim() || "email@domain.com"}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-center text-[11px] text-indigo-200/90 pt-2 border-t border-white/15">
                <span>ID: RB-2026-{formData.username ? formData.username.slice(0, 4).toUpperCase() : "MEMBER"}</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Tugas 3 React JS
                </span>
              </div>
            </div>
          </div>

          {/* Keuntungan Bergabung */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Akses ratusan koleksi buku fiksi, teknologi, dan sains</span>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Penyimpanan riwayat dan bookmark buku favorit</span>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Diskon khusus untuk anggota pada event buku tahunan</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SISI KANAN: FORM REGISTRASI PENGGUNA                     */}
        {/* ======================================================== */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 p-6 sm:p-9 relative">
            
            {/* Header Form */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3 border border-indigo-100 dark:border-indigo-900">
                <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping"></span>
                Tugas React JS Lanjutan #3
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Buat Akun Baru
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Lengkapi formulir di bawah ini untuk mendaftar sebagai anggota baru Ruang Baca.
              </p>
            </div>

            {/* Alert Error Server */}
            {serverError && (
              <div className="mb-5 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1 font-medium">{serverError}</div>
              </div>
            )}

            {/* FORMULIR UTAMA */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              
              {/* Field 1: Nama Lengkap */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Contoh: Aulya Reski"
                    className={`block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border transition bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      touched.name && errors.name
                        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900/30"
                        : touched.name && !errors.name
                        ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-900/30"
                        : "border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900/30"
                    }`}
                  />
                  {touched.name && !errors.name && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                {touched.name && errors.name && (
                  <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Grid: Username & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Field 2: Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Username <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                      @
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="aunya_reski"
                      className={`block w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border transition bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 font-mono ${
                        touched.username && errors.username
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900/30"
                          : touched.username && !errors.username
                          ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-900/30"
                          : "border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900/30"
                      }`}
                    />
                    {touched.username && !errors.username && (
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {touched.username && errors.username ? (
                    <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.username}
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                      Huruf kecil, angka, atau simbol _ dan - tanpa spasi.
                    </p>
                  )}
                </div>

                {/* Field 3: Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Alamat Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="aulya@student.nurulfikri.ac.id"
                      className={`block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border transition bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                        touched.email && errors.email
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900/30"
                          : touched.email && !errors.email
                          ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-900/30"
                          : "border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900/30"
                      }`}
                    />
                    {touched.email && !errors.email && (
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {touched.email && errors.email && (
                    <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Grid: Password & Konfirmasi Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Field 4: Password */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                    >
                      Kata Sandi <span className="text-rose-500">*</span>
                    </label>
                    {formData.password && (
                      <span className={`text-[11px] font-semibold ${passwordStrength.text}`}>
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Minimal 6 karakter"
                      className={`block w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border transition bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                        touched.password && errors.password
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900/30"
                          : touched.password && !errors.password
                          ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-900/30"
                          : "border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900/30"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                      title={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Password Strength Meter Bar */}
                  {formData.password && (
                    <div className="mt-1.5 flex gap-1 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${passwordStrength.score >= 1 ? passwordStrength.color : "bg-transparent"} w-1/4`} />
                      <div className={`h-full transition-all duration-300 ${passwordStrength.score >= 2 ? passwordStrength.color : "bg-transparent"} w-1/4`} />
                      <div className={`h-full transition-all duration-300 ${passwordStrength.score >= 3 ? passwordStrength.color : "bg-transparent"} w-1/4`} />
                      <div className={`h-full transition-all duration-300 ${passwordStrength.score >= 4 ? passwordStrength.color : "bg-transparent"} w-1/4`} />
                    </div>
                  )}

                  {touched.password && errors.password && (
                    <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Field 5: Konfirmasi Password */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label
                      htmlFor="password_confirmation"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                    >
                      Ulangi Kata Sandi <span className="text-rose-500">*</span>
                    </label>
                    {formData.password_confirmation && formData.password === formData.password_confirmation && (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Cocok ✓
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="password_confirmation"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Ketik ulang kata sandi"
                      className={`block w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border transition bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                        touched.password_confirmation && errors.password_confirmation
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900/30"
                          : touched.password_confirmation && !errors.password_confirmation
                          ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-900/30"
                          : "border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900/30"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                      title={showConfirmPassword ? "Sembunyikan sandi" : "Lihat sandi"}
                    >
                      {showConfirmPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {touched.password_confirmation && errors.password_confirmation && (
                    <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.password_confirmation}
                    </p>
                  )}
                </div>
              </div>

              {/* Field 6: Terms & Conditions Checkbox */}
              <div className="pt-1">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-4 h-4 text-indigo-600 bg-slate-50 border-slate-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-slate-900 dark:bg-slate-800 dark:border-slate-700 cursor-pointer"
                    />
                  </div>
                  <label
                    htmlFor="agreeTerms"
                    className="ml-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-snug cursor-pointer select-none"
                  >
                    Saya menyetujui{" "}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                      Syarat & Ketentuan Layanan
                    </span>{" "}
                    serta{" "}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                      Kebijakan Privasi
                    </span>{" "}
                    Ruang Baca.
                  </label>
                </div>
                {touched.agreeTerms && errors.agreeTerms && (
                  <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Tombol Submit Registrasi */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-900/40 shadow-lg shadow-indigo-600/25 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Mendaftarkan Akun Anda...</span>
                    </>
                  ) : (
                    <>
                      <span>Daftar Sekarang</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Link ke Halaman Login */}
              <div className="pt-3 text-center border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Sudah memiliki akun Ruang Baca?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline transition"
                  >
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL SUKSES REGISTRASI (FEEDBACK INTERAKTIF)           */}
      {/* ======================================================== */}
      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden animate-scale-up">
            
            {/* Background Accent */}
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50 dark:ring-emerald-950/30">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Registrasi Berhasil!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Selamat datang di Ruang Baca, <strong className="text-slate-900 dark:text-white">{successData.name}</strong>! Akun Anda telah siap digunakan.
            </p>

            {/* Rincian Akun Terdaftar */}
            <div className="my-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Username:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">@{successData.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Email:</span>
                <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{successData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Status Akun:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Aktif (Anggota Baru)</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Mengarahkan Anda ke halaman masuk dalam <span className="font-bold text-indigo-600 dark:text-indigo-400">{countdown}</span> detik...
            </p>

            <button
              onClick={() =>
                navigate("/login", {
                  state: {
                    registeredEmail: successData.email,
                    message: "Silakan masukkan kata sandi akun yang baru Anda daftarkan.",
                  },
                })
              }
              className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 transition shadow-md shadow-indigo-600/25"
            >
              Masuk Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
