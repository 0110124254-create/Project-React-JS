# Tugas React JS Lanjutan #3 – Fitur Registrasi Pengguna

**Nama Mahasiswa / Peserta:** Aulya Reski  
**NIM:** 0110124254  
**Institusi:** STT Terpadu Nurul Fikri (STTNF)  
**Program:** NF Academy — Fullstack Web Development  
**Mata Kuliah / Modul:** React JS Lanjutan (State Management, Form Handling, Real-time Validation, & Dual-layer API/Storage)  
**Tautan Repositori GitHub:** [https://github.com/0110124254-create/Project-React-JS](https://github.com/0110124254-create/Project-React-JS)  

---

## 📋 Deskripsi Tugas 3

Silakan buat fitur registrasi pengguna sebagai bagian dari pengembangan aplikasi berbasis React JS. Anda diberikan kebebasan untuk merancang desain antarmuka (UI) sesuai kreativitas masing-masing. Pastikan tampilan yang dibuat bersifat responsif, menarik secara visual, dan mudah digunakan oleh pengguna.

### Kriteria Umum:
1. **Form registrasi setidaknya memuat field:** nama lengkap, email, username, password (serta konfirmasi password).
2. **Validasi form sederhana:** tidak boleh kosong, format email valid, username alfanumerik tanpa spasi, minimal karakter password, kesesuaian konfirmasi password.
3. **Gunakan komponen React secara efektif dan efisien:** Controlled components, custom validation handlers, feedback real-time, loading spinner, dan modal interaktif.
4. **Struktur folder dan penulisan kode harus rapi dan mudah dipahami.**
5. **Langkah Pengumpulan:**
   - Upload seluruh kode ke GitHub dalam bentuk repository private.
   - Undang (invite) mentor sebagai kolaborator.
   - Salin tautan repository dan simpan ke dokumen pengumpulan (Word / PDF) untuk disubmit ke LMS.

---

## 🚀 Fitur Unggulan & Implementasi Teknis

### 1. Form Registrasi Lengkap & Terstruktur
Komponen registrasi diimplementasikan pada file [`src/pages/auth/register.jsx`](file:///C:/Users/01101/OneDrive/Dokumen/Project%20React%20JS/react-js/src/pages/auth/register.jsx):
- **Nama Lengkap (`name`):** Wajib diisi, minimal 3 karakter.
- **Username (`username`):** Wajib diisi, otomatis huruf kecil dan menghapus spasi, minimal 3 karakter, alfanumerik/simbol strip & titik (`@username`).
- **Alamat Email (`email`):** Wajib diisi dengan validasi regex standar (`^[^\s@]+@[^\s@]+\.[^\s@]+$`).
- **Kata Sandi (`password`):** Minimal 6 karakter, dilengkapi tombol *toggle show/hide password* dan meter kekuatan sandi.
- **Konfirmasi Kata Sandi (`password_confirmation`):** Validasi kesesuaian karakter secara langsung terhadap kata sandi dengan indikator visual *Cocok ✓*.
- **Persetujuan Syarat & Ketentuan (`agreeTerms`):** Checkbox persetujuan kebijakan privasi dan ketentuan keanggotaan Ruang Baca.

### 2. Kreativitas Antarmuka: Live Digital Membership Card Preview
- Di sisi kiri halaman registrasi, terdapat **Kartu Anggota Digital (Live Preview Card)** berdesain modern gradien ungu-indigo.
- Setiap karakter yang diketikkan pengguna pada form nama, username, dan email langsung terproyeksikan secara *real-time* ke kartu keanggotaan.
- Menampilkan avatar inisial otomatis (misal: "AR" untuk Aulya Reski), status verifikasi akun, dan nomor keanggotaan unik.

### 3. Password Strength Indicator (Meter Kekuatan Sandi)
- Menghitung skor kekuatan sandi secara dinamis berdasarkan panjang karakter, kombinasi huruf besar/kecil, angka, dan simbol.
- Memberikan visualisasi bar 4 level warna:
  - Level 1: *Sangat Lemah* (Merah)
  - Level 2: *Cukup* (Kuning/Amber)
  - Level 3: *Kuat* (Hijau Emerald)
  - Level 4: *Sangat Kuat* (Indigo)

### 4. Validasi Interaktif (OnBlur, OnChange, & OnSubmit)
- **OnBlur:** Memvalidasi field saat pengguna berpindah ke input lain sehingga pengguna langsung tahu jika ada format yang keliru tanpa harus menunggu menekan tombol submit.
- **OnChange:** Menghilangkan pesan error secara dinamis saat pengguna memperbaiki isian form.
- **OnSubmit:** Melakukan pemeriksaan akhir menyeluruh terhadap semua field sebelum data dikirimkan ke server.

### 5. Arsitektur Dual-Layer: API Laravel Sanctum & LocalStorage Fallback
Implementasi pada [`src/services/api.js`](file:///C:/Users/01101/OneDrive/Dokumen/Project%20React%20JS/react-js/src/services/api.js):
- **Lapisan 1 (API Laravel):** Mengirim request `POST /api/register` ke backend Laravel yang memvalidasi data dan mengembalikan Bearer token Sanctum.
- **Lapisan 2 (LocalStorage Fallback):** Jika backend Laravel tidak sedang berjalan (*offline*), data pengguna baru tetap tersimpan secara persisten pada `localStorage` (`app_registered_users`), lengkap dengan pengecekan keunikan email dan username, sehingga penguji/dosen dapat menguji seluruh alur pendaftaran dan login secara mulus tanpa ketergantungan server lokal.

### 6. Modal Dialog Sukses & Transisi Mulus ke Halaman Login
- Setelah formulir berhasil disubmit, muncul modal perayaan sukses berlatar *backdrop blur*.
- Modal menampilkan ringkasan data akun terdaftar (Nama, Username, Email, Status Aktif).
- Terdapat hitung mundur (*countdown*) 4 detik yang secara otomatis mengarahkan pengguna ke halaman login [`src/pages/auth/login.jsx`](file:///C:/Users/01101/OneDrive/Dokumen/Project%20React%20JS/react-js/src/pages/auth/login.jsx) dengan email yang langsung terisi otomatis (*pre-filled*).

---

## 📂 Struktur File Terkait

```text
Project-React-JS/
├── src/
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── register.jsx       <-- Halaman Utama Form Registrasi Pengguna
│   │   │   └── login.jsx          <-- Halaman Login Pengguna & Admin (Integrasi Auth)
│   │   └── admin/
│   │       └── index.jsx          <-- Admin Dashboard (Statistik Anggota Terdaftar)
│   ├── services/
│   │   └── api.js                 <-- registerUser, loginUser, getRegisteredUsers
│   ├── components/
│   │   └── navbar.jsx             <-- Navigasi Tombol Daftar & Masuk
│   ├── layouts/
│   │   └── admin.jsx              <-- Footnote Tugas 3 React JS Lanjutan
│   └── App.jsx                    <-- Routing /register dan /login
├── TUGAS-1-REACT-LANJUTAN.md
├── TUGAS-2-REACT-LANJUTAN.md
└── TUGAS-3-REACT-LANJUTAN.md      <-- Dokumentasi Tugas 3 ini
```

---

## 🧑‍💻 Identitas & Hak Cipta Karya

Seluruh kode program ini dibuat secara mandiri oleh **Aulya Reski** (NIM: 0110124254), mahasiswa STT Terpadu Nurul Fikri, untuk memenuhi ketentuan **Tugas React JS Lanjutan #3 – Fitur Registrasi Pengguna** pada program NF Academy Fullstack Web Development.
