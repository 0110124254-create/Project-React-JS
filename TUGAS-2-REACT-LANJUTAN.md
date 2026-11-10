# Tugas 2 React JS Lanjutan — Fitur Update dan Delete Data Genre dan Author

**Nama Mahasiswa / Peserta:** Aulya Reski  
**NIM:** 0110124254  
**Institusi:** STT Terpadu Nurul Fikri (STTNF)  
**Program:** NF Academy — Fullstack Web Development  
**Mata Kuliah / Modul:** React JS Lanjutan (Operasi CRUD Lengkap: Update & Delete dengan Axios)  
**Tautan Repositori GitHub:** [https://github.com/0110124254-create/Project-React-JS](https://github.com/0110124254-create/Project-React-JS)  

---

## 📋 Deskripsi Tugas 2

1. **Membuat fitur Update dan Delete data untuk bagian Genre pada tampilan Admin.**
2. **Membuat fitur Update dan Delete data untuk bagian Author pada tampilan Admin.**
3. **Mendesain antarmuka (UI/UX) sesuai kreativitas masing-masing menggunakan Tailwind CSS.**
4. **Mengunggah kode ke GitHub repositori privat, mengundang username mentor masing-masing, dan menyusun laporan format PDF untuk dikumpulkan ke LMS.**

---

## 🚀 Fitur yang Telah Diimplementasikan (Tugas 2)

### 1. Operasi Update & Delete Data Genre (Kategori Buku)
- **Update Data Genre (`/admin/genres/edit/:id`):**
  - Mengambil data eksisting genre berdasarkan ID menggunakan `getGenreById(id)` saat halaman dibuka (`useEffect`).
  - Formulir input terisi otomatis (*pre-filled*) dengan data nama dan deskripsi genre yang ada.
  - **Live Preview Real-Time:** Menampilkan pratinjau langsung badge kategori dan kartu genre saat admin mengubah input.
  - Pengiriman data perubahan ke server REST API via HTTP method **PUT** (`PUT /api/genres/{id}`) menggunakan library **Axios**.
  - Validasi input, penanganan loading saat submitting, alert notifikasi sukses berwarna hijau, dan *auto-redirect* kembali ke tabel genre.
- **Delete Data Genre (`/admin/genres`):**
  - Tombol **Hapus** pada setiap baris data tabel genre.
  - **Modal Konfirmasi Interaktif:** Pop-up dialog peringatan yang menampilkan nama genre yang akan dihapus sebelum konfirmasi akhir dilakukan.
  - Pengiriman permintaan hapus ke server REST API via HTTP method **DELETE** (`DELETE /api/genres/{id}`) menggunakan Axios.
  - Penghapusan data secara reaktif dari state tabel dan pembaruan cache penyimpanan lokal (*LocalStorage*).

### 2. Operasi Update & Delete Data Author (Penulis Buku)
- **Update Data Author (`/admin/authors/edit/:id`):**
  - Memuat data profil penulis yang dipilih menggunakan `getAuthorById(id)`.
  - Formulir pengeditan terisi otomatis (*pre-filled*) untuk Nama Lengkap, Kewarganegaraan / Negara Asal, dan Biografi pengarang.
  - **Pilihan Cepat (Quick Chips):** Tombol pintas negara populer (Indonesia, Jepang, Inggris, Amerika Serikat) untuk kemudahan pengeditan.
  - **Live Preview Profil Penulis:** Pratinjau langsung kartu profil lengkap dengan avatar inisial bergradien warna dan kutipan bio.
  - Pengiriman data terbarui via HTTP method **PUT** (`PUT /api/authors/{id}`) menggunakan Axios.
  - Alert notifikasi sukses dan navigasi kembali ke `/admin/authors`.
- **Delete Data Author (`/admin/authors`):**
  - Tombol **Hapus** pada setiap baris tabel penulis.
  - **Modal Konfirmasi Hapus:** Menampilkan peringatan sebelum menghapus pengarang dari sistem.
  - Eksekusi asynchronous via HTTP method **DELETE** (`DELETE /api/authors/{id}`) menggunakan Axios.
  - Pembaruan state komponen secara instan tanpa perlu reload halaman browser.

### 3. Tampilan Antarmuka & Desain Kreatif (UI/UX)
- Tombol aksi **Edit** dan **Hapus** dirancang harmonis dan terstruktur di setiap baris tabel dengan ikon visual dan efek hover transisi.
- Indikator status koneksi API (Live Server REST API Laravel vs Offline Cache Fallback).
- Single Page Application (SPA) navigasi menggunakan React Router 7 (`NavLink`, `useParams`, `useNavigate`).

---

## 🛠️ Ringkasan Endpoint API & Metode HTTP

| Fitur | Method | Endpoint URL | Fungsi |
|---|---|---|---|
| Read Genre | `GET` | `/api/genres` | Menampilkan seluruh daftar genre |
| Detail Genre | `GET` | `/api/genres/{id}` | Mengambil data 1 genre untuk form edit |
| Create Genre | `POST` | `/api/genres` | Menambahkan data genre baru |
| **Update Genre** | `PUT` | `/api/genres/{id}` | **Memperbarui rincian data genre** |
| **Delete Genre** | `DELETE` | `/api/genres/{id}` | **Menghapus data genre dari sistem** |
| Read Author | `GET` | `/api/authors` | Menampilkan daftar seluruh penulis |
| Detail Author | `GET` | `/api/authors/{id}` | Mengambil data 1 penulis untuk form edit |
| Create Author | `POST` | `/api/authors` | Menambahkan data penulis baru |
| **Update Author** | `PUT` | `/api/authors/{id}` | **Memperbarui profil data penulis** |
| **Delete Author** | `DELETE` | `/api/authors/{id}` | **Menghapus data penulis dari sistem** |

---

## 💻 Cara Menjalankan Proyek di Lokal

1. Buka PowerShell pada direktori proyek React JS:
   ```powershell
   cd "C:\Users\01101\OneDrive\Dokumen\Project React JS\react-js"
   npm.cmd run dev
   ```
2. Buka peramban (browser) di:
   - Panel Admin Genre: `http://localhost:5173/admin/genres`
   - Panel Admin Penulis: `http://localhost:5173/admin/authors`
3. (Opsional) Jalankan backend Laravel di folder `booksales-api`:
   ```powershell
   php artisan serve
   ```
   *Catatan: Sistem telah dilengkapi fitur offline storage fallback otomatis sehingga operasi Update dan Delete tetap berjalan lancar 100% meskipun backend Laravel sedang offline.*

