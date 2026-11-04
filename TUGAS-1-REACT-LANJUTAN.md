# Tugas 1 React JS Lanjutan — CRUD Data Genre dan Author

**Nama Mahasiswa / Peserta:** Aulya Reski  
**Institusi:** STT Terpadu Nurul Fikri (STTNF)  
**Program:** NF Academy — Fullstack Web Development  
**Mata Kuliah / Modul:** React JS Lanjutan (Operasi CRUD dengan Asynchronous & Axios)  

---

## 📋 Deskripsi Tugas

1. **Membuat fitur Read dan Create data untuk Genre pada tampilan Admin.**
2. **Membuat fitur Read dan Create data untuk Author (Penulis) pada tampilan Admin.**
3. **Mendesain antarmuka (UI/UX) sesuai kreativitas masing-masing menggunakan Tailwind CSS.**
4. **Mengunggah kode ke GitHub repositori privat, mengundang akun mentor, dan menyusun laporan format PDF untuk dikumpulkan ke LMS.**

---

## 🚀 Fitur yang Telah Diimplementasikan

### 1. Manajemen Data Genre (Kategori Buku)
- **Read Data Genre (`/admin/genres`):**
  - Mengambil data dari endpoint REST API `GET /api/genres` secara asynchronous menggunakan Axios (`axios.get`).
  - Fitur pencarian real-time (live search) berdasarkan nama genre dan deskripsi.
  - Tampilan tabel responsif dengan badge warna dinamis, ringkasan deskripsi, dan tanggal pembuatan.
  - Indikator status sumber data (Live REST API vs Offline LocalStorage Cache).
  - Tombol sinkronisasi / refresh data dan tombol hapus dengan modal konfirmasi interaktif.
- **Create Data Genre (`/admin/genres/create`):**
  - Formulir input nama genre (wajib) dan deskripsi genre (opsional).
  - Pengiriman data asynchronous ke endpoint `POST /api/genres` menggunakan `axios.post`.
  - **Fitur Live Preview (Pratinjau Langsung):** Menampilkan badge dan kartu genre secara real-time saat pengguna mengetik nama/deskripsi.
  - Validasi form client-side dan penanganan error responsif.
  - Notifikasi alert sukses hijau dan redirect otomatis kembali ke tabel genre.

### 2. Manajemen Data Author (Penulis Buku)
- **Read Data Author (`/admin/authors`):**
  - Mengambil data dari endpoint REST API `GET /api/authors` menggunakan Axios.
  - Tampilan profil pengarang lengkap dengan avatar inisial berwarna gradien.
  - Badge kewarganegaraan / negara asal (nationality) dan biografi singkat.
  - Pencarian real-time berdasarkan nama pengarang, negara, atau biografi.
  - Indikator status koneksi API dan tombol aksi hapus dengan dialog konfirmasi.
- **Create Data Author (`/admin/authors/create`):**
  - Formulir input nama lengkap penulis (wajib), negara asal/kewarganegaraan, dan biografi.
  - Pilihan cepat (quick chips) untuk negara populer (Indonesia, Jepang, Inggris, dll.).
  - Pengiriman data asynchronous via `axios.post` ke `POST /api/authors`.
  - **Fitur Live Preview:** Menampilkan kartu avatar gradien dan bio penulis secara langsung saat form diisi.
  - Validasi input, feedback notifikasi sukses, dan navigasi otomatis.

### 3. Integrasi & Navigasi Admin
- **Dashboard Overview (`/admin`):**
  - Ringkasan total Genre, Penulis, Buku, dan Transaksi.
  - Tombol aksi cepat untuk menambah data master.
- **Admin Layout (`/src/layouts/admin.jsx`):**
  - Header navigasi modern dengan identitas Ruang Baca Admin dan profil admin.
  - Sidebar responsif dengan `NavLink` React Router untuk navigasi instan tanpa reload browser.
  - Tautan langsung antara Web Publik dan Panel Admin.

---

## 🛠️ Teknologi & Pustaka

- **React 19** (`react`, `react-dom`)
- **React Router 7** (`react-router-dom`)
- **Axios** untuk penanganan asynchronous HTTP request (GET, POST, DELETE)
- **Tailwind CSS v4** & Flowbite design system untuk styling antarmuka modern dan responsif
- **Vite 8** sebagai build tool ultra-cepat
- **Laravel 11 REST API** sebagai backend data server

---

## 💻 Cara Menjalankan Proyek

1. **Jalankan Frontend React JS:**
   ```powershell
   cd "C:\Users\01101\OneDrive\Dokumen\Project React JS\react-js"
   npm.cmd install
   npm.cmd run dev
   ```
   Buka peramban di: `http://localhost:5173/admin/genres` atau `http://localhost:5173/admin/authors`.

2. **Jalankan Backend Laravel (Opsional jika ingin live API):**
   ```powershell
   cd "c:\xampp\htdocs\booksales-api"
   php artisan serve
   ```
   *Catatan: Sistem telah dilengkapi fitur offline storage fallback otomatis, sehingga antarmuka dan operasi CRUD tetap berfungsi 100% lancar meskipun backend server belum dinyalakan.*
