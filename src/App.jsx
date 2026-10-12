import { useState } from 'react'
import { BrowserRouter, NavLink, Outlet, Route, Routes, useOutletContext } from 'react-router-dom'
import booksData from './Utils/books.js'
import '../App.css'

const formatPrice = (price) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
}).format(price)

function Header() {
  return (
    <header className="site-header">
      <nav className="container nav-wrap" aria-label="Navigasi utama">
        <NavLink className="brand" to="/" aria-label="Ruang Baca, beranda">
          <span className="brand-icon" aria-hidden="true">rb</span>
          <span>ruang<span className="brand-accent">baca</span><small>BOOKS & STORIES</small></span>
        </NavLink>
        <div className="nav-links">
          <NavLink to="/" end>Beranda</NavLink>
          <NavLink to="/buku">Koleksi Buku</NavLink>
          <NavLink to="/team">Tim</NavLink>
          <NavLink to="/contact">Kontak</NavLink>
        </div>
        <NavLink className="nav-cta" to="/login">Masuk <span aria-hidden="true">↗</span></NavLink>
      </nav>
    </header>
  )
}

function BookCard({ book, index = 0 }) {
  return (
    <article className="book-card">
      <div className="book-cover-wrap">
        <img className="book-cover" src={book.image} alt={`Sampul buku ${book.title}`} loading="lazy" />
        <span className="book-number">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="book-card-content">
        <span className="book-category">{book.genre}</span>
        <h3>{book.title}</h3>
        <p className="book-author">oleh {book.author}</p>
        <div className="book-card-bottom">
          <strong>{formatPrice(book.price)}</strong>
          <span className="book-arrow" aria-hidden="true">↗</span>
        </div>
      </div>
    </article>
  )
}

function BookGrid({ books }) {
  if (!books.length) {
    return <p className="empty-state">Belum ada buku yang cocok. Coba kata kunci lain.</p>
  }

  return (
    <div className="book-grid">
      {books.map((book, index) => <BookCard key={book.id} book={book} index={index} />)}
    </div>
  )
}

function AddBookForm({ onAdd, onClose }) {
  const [form, setForm] = useState({ title: '', author: '', genre: '', price: '', image: '' })

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    onAdd({
      ...form,
      id: `book-${Date.now()}`,
      price: Number(form.price),
      image: form.image.trim() || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=85',
    })
    onClose()
  }

  return (
    <form className="add-book-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div><span className="eyebrow">TAMBAHKAN KE RAK</span><h2>Masukkan buku baru</h2></div>
        <button className="close-form" type="button" onClick={onClose} aria-label="Tutup formulir">×</button>
      </div>
      <div className="form-grid">
        <label>Judul buku<input name="title" value={form.title} onChange={handleChange} placeholder="Contoh: Laut Bercerita" required /></label>
        <label>Nama penulis<input name="author" value={form.author} onChange={handleChange} placeholder="Nama penulis" required /></label>
        <label>Genre<input name="genre" value={form.genre} onChange={handleChange} placeholder="Contoh: Fiksi" required /></label>
        <label>Harga (rupiah)<input name="price" type="number" min="1" value={form.price} onChange={handleChange} placeholder="85000" required /></label>
        <label className="form-wide">URL gambar sampul <span className="optional-label">(opsional)</span><input name="image" type="url" value={form.image} onChange={handleChange} placeholder="https://..." /></label>
      </div>
      <button className="primary-button" type="submit">Tambahkan ke koleksi <span aria-hidden="true">↗</span></button>
    </form>
  )
}

function HomePage() {
  const { books } = useOutletContext()

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow"><span className="eyebrow-line" /> TOKO BUKU PILIHAN · SEJAK 2026</span>
          <h1>Temukan cerita<br />yang <em>tinggal</em><br />di hati.</h1>
          <p>Setiap buku membuka pintu ke dunia baru. Temukan bacaan yang tepat untuk menemani jeda, perjalanan, dan hari-harimu.</p>
          <NavLink className="primary-button" to="/buku">Jelajahi koleksi <span aria-hidden="true">↗</span></NavLink>
          <div className="hero-note"><span aria-hidden="true">✳</span> Pilihan bacaan, dikurasi dengan rasa.</div>
        </div>
        <div className="hero-art" aria-label="Tumpukan buku bacaan">
          <div className="hero-orbit" />
          <div className="hero-book hero-book-back"><span>THE ART<br />OF READING</span><small>STORIES FOR SLOW DAYS</small></div>
          <div className="hero-book hero-book-front"><span>Ruang<br /><i>untuk</i><br />pulang</span><small>SEBUAH KUMPULAN CERITA</small></div>
          <span className="hero-art-caption">VOL. 01 — FIND YOUR NEXT STORY</span>
          <span className="hero-spark" aria-hidden="true">✳</span>
        </div>
        <div className="hero-index">01 <span /> 03</div>
      </section>

      <section className="intro-strip">
        <div className="container intro-inner"><span>RUANG BACA</span><p>Bukan sekadar membaca. Ini tentang menemukan bagian dari dirimu di dalam sebuah cerita.</p><span aria-hidden="true">✳</span></div>
      </section>

      <section className="featured-section section-pad">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">SEMBILAN CERITA PILIHAN</span><h2>Koleksi buku untukmu.</h2></div>
            <NavLink className="text-link" to="/buku">Cari &amp; tambah koleksi <span aria-hidden="true">↗</span></NavLink>
          </div>
          <BookGrid books={books} />
        </div>
      </section>

      <section className="quote-section">
        <span className="quote-mark" aria-hidden="true">“</span>
        <p>Di antara halaman-halaman buku, selalu ada ruang untuk menemukan diri sendiri.</p>
        <span className="quote-caption">SEBUAH PENGINGAT DARI RUANG BACA</span>
      </section>
    </>
  )
}

function BooksPage() {
  const { books, addBook } = useOutletContext()
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <>
      <section className="collection-hero">
        <div className="container collection-heading">
          <span className="eyebrow">RAK BUKU KAMI</span>
          <h1>Semua cerita,<br /><em>menunggu dibuka.</em></h1>
          <p>Jelajahi koleksi pilihan dan temukan bacaan berikutnya yang terasa seperti dibuat untukmu.</p>
          <div className="collection-meta"><span>{books.length} BUKU DALAM KOLEKSI</span><span>DIKURASI DENGAN HATI ✳</span></div>
        </div>
      </section>
      <section className="collection-section section-pad">
        <div className="container">
          <div className="collection-tools">
            <label className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari judul, penulis, atau genre..." aria-label="Cari buku" /></label>
            <button className="primary-button" type="button" onClick={() => setShowForm(!showForm)}>{showForm ? 'Tutup formulir' : '+ Tambah buku'}</button>
          </div>
          {showForm && <AddBookForm onAdd={addBook} onClose={() => setShowForm(false)} />}
          <BookGrid books={filteredBooks} />
        </div>
      </section>
    </>
  )
}

const teamMembers = [
  {
    name: 'Nadia Putri',
    role: 'Pendiri & Kurator Buku',
    bio: 'Memilih cerita yang membuat pembaca berhenti sejenak, berpikir, lalu ingin membaca satu halaman lagi.',
    initials: 'NP',
    color: 'rose',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&h=900&q=85',
  },
  {
    name: 'Raka Pratama',
    role: 'Pengelola Koleksi',
    bio: 'Menjaga rak tetap beragam dan membantu setiap buku menemukan pembaca yang tepat.',
    initials: 'RP',
    color: 'sage',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&h=900&q=85',
  },
  {
    name: 'Salsa Maharani',
    role: 'Komunitas & Pembaca',
    bio: 'Menghubungkan para pecinta buku lewat rekomendasi, obrolan, dan cerita yang dibagikan.',
    initials: 'SM',
    color: 'ochre',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&h=900&q=85',
  },
  {
    name: 'Aulya Reski',
    role: 'Tim Ruang Baca',
    bio: 'Turut merawat Ruang Baca dan berbagi kecintaan pada buku serta cerita.',
    initials: 'AR',
    color: 'rose',
    image: '/aulya-reski-square.jpg',
  },
]

function TeamPage() {
  return (
    <>
      <section className="collection-hero">
        <div className="container collection-heading">
          <span className="eyebrow">ORANG DI BALIK RUANG BACA</span>
          <h1>Kenalan dengan<br /><em>tim kecil kami.</em></h1>
          <p>Kami percaya setiap buku punya pembacanya. Dengan rasa ingin tahu dan cinta pada cerita, kami merawat Ruang Baca untukmu.</p>
        </div>
      </section>
      <section className="team-section section-pad">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">DENGAN SENANG HATI</span><h2>Para penjaga cerita.</h2></div>
            <p className="team-intro">Tim kami mungkin kecil, tapi selalu punya ruang untuk satu cerita lagi.</p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <article className="team-card" key={member.name}>
                <div className={`team-avatar ${member.color} ${member.image ? 'has-photo' : ''}`}>
                  {member.image
                    ? <img className="team-photo" src={member.image} alt={`Foto ${member.name}`} loading="lazy" />
                    : <span aria-hidden="true">{member.initials}</span>}
                  <small aria-hidden="true">0{index + 1}</small>
                </div>
                <span className="team-role">{member.role}</span>
                <h3>{member.name}</h3>
                <p>{member.bio}</p>
              </article>
            ))}
          </div>
          <div className="team-note">
            <span aria-hidden="true">✳</span>
            <p>Ruang Baca adalah toko buku konsep untuk berbagi kecintaan pada membaca dan cerita.</p>
          </div>
        </div>
      </section>
      <section className="team-cta">
        <div className="container team-cta-inner">
          <div><span className="eyebrow">PUNYA CERITA UNTUK KAMI?</span><h2>Obrolan baik<br /><em>selalu dimulai dari halo.</em></h2></div>
          <NavLink className="primary-button" to="/contact">Sapa tim kami <span aria-hidden="true">↗</span></NavLink>
        </div>
      </section>
    </>
  )
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    event.currentTarget.reset()
  }

  return (
    <>
      <section className="collection-hero">
        <div className="container collection-heading">
          <span className="eyebrow">PINTU KAMI SELALU TERBUKA</span>
          <h1>Ada yang ingin<br /><em>kamu ceritakan?</em></h1>
          <p>Tanya soal koleksi, berbagi rekomendasi buku, atau sekadar menyapa. Kami senang mendengar darimu.</p>
        </div>
      </section>
      <section className="contact-section section-pad">
        <div className="container contact-grid">
          <div className="contact-info">
            <span className="eyebrow">SAPA RUANG BACA</span>
            <h2>Mulai dari<br />sebuah pesan.</h2>
            <p>Kami ingin Ruang Baca jadi tempat yang nyaman untuk semua pembaca. Kirimkan pertanyaan atau ide kamu lewat formulir ini.</p>
            <div className="contact-detail">
              <span className="contact-detail-icon" aria-hidden="true">@</span>
              <div><small>EMAIL</small><a href="mailto:halo@ruangbaca.example">halo@ruangbaca.example</a></div>
            </div>
            <div className="contact-detail">
              <span className="contact-detail-icon" aria-hidden="true">◷</span>
              <div><small>WAKTU BALAS</small><span>Senin–Jumat · 09.00–17.00 WIB</span></div>
            </div>
            <p className="contact-disclaimer">Ruang Baca adalah proyek demo. Formulir ini belum mengirim pesan ke server.</p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Kirim pesan</h2>
            <label>Nama<input name="name" type="text" autoComplete="name" placeholder="Nama kamu" required /></label>
            <label>Email<input name="email" type="email" autoComplete="email" placeholder="kamu@email.com" required /></label>
            <label>Topik
              <select name="topic" defaultValue="" required>
                <option value="" disabled>Pilih topik pesan</option>
                <option value="books">Koleksi buku</option>
                <option value="recommendation">Rekomendasi bacaan</option>
                <option value="collaboration">Kerja sama</option>
                <option value="other">Lainnya</option>
              </select>
            </label>
            <label>Pesan<textarea name="message" rows="5" placeholder="Ceritakan pesanmu..." required /></label>
            <button className="primary-button" type="submit">Kirim pesan <span aria-hidden="true">↗</span></button>
            {submitted && <p className="contact-success" role="status">Terima kasih sudah menyapa! Ini formulir demo dan pesan belum dikirim ke server.</p>}
          </form>
        </div>
      </section>
    </>
  )
}

function RegisterPage() {
  const [registered, setRegistered] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    if (formData.get('password') !== formData.get('passwordConfirmation')) {
      setError('Konfirmasi kata sandi belum cocok. Silakan periksa kembali.')
      setRegistered(false)
      return
    }

    setError('')
    setRegistered(true)
    event.currentTarget.reset()
  }

  return (
    <>
      <section className="collection-hero">
        <div className="container collection-heading">
          <span className="eyebrow">JADI BAGIAN DARI CERITA</span>
          <h1>Buat ruang<br /><em>bacamu sendiri.</em></h1>
          <p>Daftar untuk bergabung dengan komunitas Ruang Baca dan mulai menemukan bacaan favoritmu.</p>
        </div>
      </section>
      <section className="register-section section-pad">
        <div className="register-card">
          <div className="register-card-heading">
            <span className="eyebrow">SELAMAT DATANG</span>
            <h2>Buat akun baru</h2>
            <p>Isi data di bawah ini untuk mendaftar.</p>
          </div>
          <form className="contact-form register-form" onSubmit={handleSubmit}>
            <label>Nama lengkap<input name="name" type="text" autoComplete="name" placeholder="Nama kamu" required /></label>
            <label>Email<input name="email" type="email" autoComplete="email" placeholder="kamu@email.com" required /></label>
            <label>Kata sandi<input name="password" type="password" autoComplete="new-password" minLength="8" placeholder="Minimal 8 karakter" required /></label>
            <label>Konfirmasi kata sandi<input name="passwordConfirmation" type="password" autoComplete="new-password" minLength="8" placeholder="Ulangi kata sandi" required /></label>
            {error && <p className="register-error" role="alert">{error}</p>}
            <button className="primary-button register-submit" type="submit">Buat akun <span aria-hidden="true">↗</span></button>
            {registered && <p className="contact-success" role="status">Pendaftaran demo berhasil! Akun belum disimpan karena aplikasi ini belum terhubung ke server.</p>}
          </form>
          <p className="register-disclaimer">Formulir demo — jangan gunakan kata sandi asli. Data tidak dikirim atau disimpan.</p>
        </div>
      </section>
    </>
  )
}

function LoginPage() {
  const [loggedIn, setLoggedIn] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setLoggedIn(true)
    event.currentTarget.reset()
  }

  return (
    <>
      <section className="collection-hero">
        <div className="container collection-heading">
          <span className="eyebrow">SENANG BERTEMU KEMBALI</span>
          <h1>Ceritamu<br /><em>berlanjut di sini.</em></h1>
          <p>Masuk ke Ruang Baca dan lanjutkan perjalananmu menemukan cerita-cerita baru.</p>
        </div>
      </section>
      <section className="register-section section-pad">
        <div className="register-card">
          <div className="register-card-heading">
            <span className="eyebrow">SELAMAT DATANG KEMBALI</span>
            <h2>Masuk ke akunmu</h2>
            <p>Isi email dan kata sandi untuk mencoba alur login demo.</p>
          </div>
          <form className="contact-form register-form" onSubmit={handleSubmit}>
            <label>Email<input name="email" type="email" autoComplete="email" placeholder="kamu@email.com" required /></label>
            <label>Kata sandi<input name="password" type="password" autoComplete="current-password" minLength="8" placeholder="Minimal 8 karakter" required /></label>
            <button className="primary-button register-submit" type="submit">Masuk <span aria-hidden="true">↗</span></button>
            {loggedIn && <p className="contact-success" role="status">Simulasi login berhasil. Kamu belum benar-benar masuk karena demo ini belum terhubung ke server.</p>}
          </form>
          <p className="register-disclaimer">Demo frontend saja. Email dan kata sandi tidak diperiksa, dikirim, atau disimpan.</p>
          <p className="auth-switch">Belum punya akun? <NavLink to="/register">Daftar di sini</NavLink></p>
        </div>
      </section>
    </>
  )
}

function NotFoundPage() {
  return <section className="not-found"><span className="eyebrow">HALAMAN TIDAK DITEMUKAN</span><h1>Sepertinya halaman ini belum ada di rak.</h1><NavLink className="primary-button" to="/">Kembali ke beranda ↗</NavLink></section>
}

function AppLayout() {
  const [books, setBooks] = useState(booksData)
  const addBook = (book) => setBooks((currentBooks) => [book, ...currentBooks])

  return (
    <div className="app-shell">
      <Header />
      <main><Outlet context={{ books, addBook }} /></main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <NavLink className="brand footer-brand" to="/"><span className="brand-icon" aria-hidden="true">rb</span><span>ruang<span className="brand-accent">baca</span><small>BOOKS & STORIES</small></span></NavLink>
          <p>Temukan cerita. Temukan dirimu.</p>
          <span>© 2026 Ruang Baca · Dibuat untuk para pecinta buku.</span>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/buku" element={<BooksPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
