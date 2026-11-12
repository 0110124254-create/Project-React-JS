# Tugas React JS Lanjutan #4 – Routing & Hak Akses Pengguna (Role-Based Access Control)

**Nama Mahasiswa / Peserta:** Aulya Reski  
**NIM:** 0110124254  
**Institusi:** STT Terpadu Nurul Fikri (STTNF)  
**Program:** NF Academy — Fullstack Web Development  
**Mata Kuliah / Modul:** React JS Lanjutan (Routing, Otorisasi, Protected Routes, & Role-Based Access Control)  
**Tautan Repositori GitHub:** [https://github.com/0110124254-create/Project-React-JS](https://github.com/0110124254-create/Project-React-JS)  

---

## 📋 Deskripsi Tugas 4

Tambahkan pengaturan routing dan service otorisasi pada project React JS Anda untuk membatasi akses antara pengguna biasa (*user*) dan administrator (*admin*). Anda boleh menyesuaikan implementasi ini berdasarkan kreativitas masing-masing atau merujuk pada struktur dan peran yang digunakan di project backend (jika ada).

### 🎯 Tujuan Pembelajaran
1. Memahami konsep **Protected Route** dalam React JS.
2. Mengatur navigasi berdasarkan peran pengguna (**Role-Based Access Control / RBAC**).
3. Meningkatkan keamanan dan struktur arsitektur aplikasi frontend.

### 📌 Ketentuan Umum & Pemenuhannya
- **Logika Pembeda Hak Akses:** Membedakan peran `admin` dan `user` secara tegas menggunakan Context API dan localStorage.
- **Pembatasan Halaman Sesuai Peran:**
  - Halaman `/admin/*` (Dashboard, CRUD Genre, CRUD Penulis, Buku, Transaksi) **hanya dapat diakses oleh Admin**.
  - Jika pengguna belum login mencoba membuka `/admin/*`, otomatis dialihkan ke `/login` dengan menyimpan rute asal (*redirect after login*).
  - Jika pengguna biasa (*user*) yang sudah login mencoba membuka `/admin/*`, dialihkan ke halaman **403 Akses Ditolak (Unauthorized)**.
  - Halaman `/user/profile` dapat diakses oleh semua pengguna yang terotentikasi (*user* & *admin*).
  - Halaman publik (`/`, `/books`, `/books/:id`) bebas diakses oleh semua pengunjung (*guest*, *user*, *admin*).
  - Halaman autentikasi (`/login`, `/register`) hanya untuk *guest*; pengguna yang sudah login dialihkan otomatis ke dashboard sesuai perannya.
- **Tools yang Digunakan:** React Router v7/v6, React Context API (`AuthContext`), LocalStorage, dan Tailwind CSS.

---

## 🚀 Arsitektur & Fitur yang Diimplementasikan

### 1. Service Otorisasi Terpusat (`src/context/AuthContext.jsx`)
Menggunakan **React Context API** untuk menyediakan state dan fungsi autentikasi global ke seluruh hierarki komponen:
- `user`: Objek data profil pengguna aktif (`id`, `name`, `username`, `email`, `role`, `is_admin`).
- `isAuthenticated`: Boolean status login (`Boolean(user && token)`).
- `isAdmin`: Boolean penentu hak akses administratif (`user?.role === 'admin' || user?.is_admin === true`).
- `role`: String peran pengguna (`admin`, `user`, atau `guest`).
- `login(credentials)`: Memvalidasi kredensial dan menyelaraskan state ke `localStorage`.
- `logout()`: Menghapus token dan sesi pengguna serta membersihkan state global.
- `switchDemoRole(targetRole)`: Fitur 1-klik untuk beralih instan antara akun Admin dan User bagi dosen/evaluator.

### 2. Komponen Pelindung Rute (`src/components/ProtectedRoute.jsx`)
Komponen penjaga rute berbasis peran (*Role-Based Guard*):
```jsx
// Logika pencegatan ProtectedRoute
if (!isAuthenticated) {
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
  return (
    <Navigate
      to="/unauthorized"
      state={{ attemptedPath: location.pathname, userRole: role, requiredRoles: allowedRoles }}
      replace
    />
  );
}

return <Outlet />;
```

### 3. Komponen Guest Guard (`src/components/GuestRoute.jsx`)
Mencegah pengguna yang sudah memiliki sesi aktif membuka kembali formulir `/login` dan `/register`. Mengarahkan otomatis pengguna admin ke `/admin` dan pengguna biasa ke `/user/profile`.

### 4. Halaman 403 Akses Ditolak (`src/pages/auth/unauthorized.jsx`)
Halaman khusus yang informatif dan elegan ketika terjadi pelanggaran otorisasi:
- Menampilkan pesan peringatan 403 Forbidden dengan ikon gembok proteksi.
- Menjelaskan rute administratif yang dicegat (misal: `/admin/genres`).
- Menampilkan status peran akun saat ini (`role: user`).
- Menyediakan tombol navigasi langsung: *Buka Profil Pengguna*, *Ganti Akun ke Admin*, atau *Kembali ke Beranda*.

### 5. Halaman Profil & Dashboard Pengguna Biasa (`src/pages/user/profile.jsx`)
Halaman khusus untuk peran `user` biasa:
- Kartu identitas anggota dengan avatar dinamis.
- Ringkasan aktivitas literasi (buku sedang dibaca, wishlist, koleksi selesai dibaca).
- **Interactive RBAC Demo Box:** Memberikan penjelasan hak akses serta tombol uji coba *"Coba Akses /admin (Harus Ditolak)"* sehingga evaluator dapat langsung menguji proteksi rute dalam 1 klik.

### 6. Fitur 1-Klik Login Demo untuk Penguji (`src/pages/auth/login.jsx`)
Pada halaman login, disediakan dua tombol preset cepat untuk menguji otorisasi:
1. **👑 Masuk Admin:** Otomatis mengisi `admin@ruangbaca.com` / `password123` (Hak Akses Penuh ke `/admin`).
2. **👤 Masuk User:** Otomatis mengisi `user@ruangbaca.com` / `password123` (Hak Akses Terbatas ke `/user/profile`).

---

## 📂 Struktur Rute Aplikasi (`src/App.jsx`)

```text
/ (Publik)                   --> Home (Katalog Ringkas)
/books (Publik)              --> Katalog Buku Lengkap
/books/:id (Publik)          --> Detail Buku

/login (Guest Only)          --> Form Login (Dengan Demo 1-Klik)
/register (Guest Only)       --> Form Registrasi Akun

/user/profile (Protected)    --> Dashboard Khusus User & Admin (allowedRoles: ['user', 'admin'])
/admin/* (Protected Admin)   --> Khusus Administrator (allowedRoles: ['admin'])
    ├── /admin               --> Admin Dashboard
    ├── /admin/genres        --> CRUD Kategori Genre
    ├── /admin/authors       --> CRUD Penulis Buku
    ├── /admin/books         --> Manajemen Koleksi Buku
    └── /admin/transactions  --> Laporan Transaksi

/unauthorized (Spesial)      --> Halaman 403 Forbidden Akses Ditolak
* (Fallback)                 --> Halaman 404 Not Found
```

---

## 🧑‍💻 Akun Demo untuk Pengujian

| Peran (Role) | Email / Username | Kata Sandi | Tujuan Rute Utama | Akses ke `/admin` |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin@ruangbaca.com` / `admin` | `password123` | `/admin` | ✅ Diizinkan |
| **Pengguna Biasa** | `user@ruangbaca.com` / `user` | `password123` | `/user/profile` | ⛔ Ditolak (403) |

---

## 🛡️ Orisinalitas & Tanggung Jawab Akademik
Kode program ini dirancang dan dikembangkan secara mandiri oleh **Aulya Reski** (NIM: 0110124254) untuk memenuhi penugasan **Tugas React JS Lanjutan #4 – Routing & Hak Akses Pengguna** pada program NF Academy — STT Terpadu Nurul Fikri.

