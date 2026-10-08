import { useState } from 'react'
import { BrowserRouter, NavLink, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'

const products = [
  {
    name: 'Sunrise Orange',
    detail: 'Jeruk segar · sedikit madu',
    price: 'Rp18.000',
    image: 'photo-1600271886742-f049cd451bba',
    color: 'orange',
    badge: 'BEST SELLER',
  },
  {
    name: 'Berry Blush',
    detail: 'Stroberi · yogurt · pisang',
    price: 'Rp24.000',
    image: 'photo-1505252585461-04db1eb84625',
    color: 'pink',
    badge: 'FAVORIT',
  },
  {
    name: 'Green Garden',
    detail: 'Apel hijau · bayam · nanas',
    price: 'Rp22.000',
    image: 'photo-1534353473418-4cfa6c56fd38',
    color: 'green',
    badge: 'FRESH PICK',
  },
]

const team = [
  {
    name: 'Nadia Putri',
    role: 'Pendiri & Peracik Rasa',
    image: 'photo-1580489944761-15a19d654956',
    bio: 'Percaya bahwa minuman sehat harus terasa menyenangkan. Nadia meracik setiap menu dengan rasa ingin tahu dan bahan pilihan.',
  },
  {
    name: 'Raka Pratama',
    role: 'Operasional & Bahan Baku',
    image: 'photo-1500648767791-00dcc994a43e',
    bio: 'Menjaga perjalanan buah dari kebun sampai gelas tetap segar, teliti, dan berasal dari mitra lokal.',
  },
  {
    name: 'Salsa Maharani',
    role: 'Pengalaman Pelanggan',
    image: 'photo-1534528741775-53994a69daeb',
    bio: 'Mendengarkan cerita dan masukan pelanggan agar setiap kunjungan terasa hangat dan personal.',
  },
  {
    name: 'Aulya Reski',
    role: 'Team Segar.Hari',
    image: '/aulya-reski-square.jpg',
    bio: 'Turut menghadirkan minuman buah segar dengan perhatian dan semangat dalam setiap gelas.',
  },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-lg container py-3" aria-label="Navigasi utama">
        <NavLink className="navbar-brand brand-mark" to="/" onClick={closeMenu}>
          <span className="brand-fruit" aria-hidden="true">✿</span>
          <span>segar<span className="brand-light">.hari</span></span>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div id="primary-navigation" className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <NavLink className="nav-link" to="/" end onClick={closeMenu}>Beranda</NavLink>
            <NavLink className="nav-link" to="/team" onClick={closeMenu}>Team</NavLink>
            <NavLink className="nav-link" to="/contact" onClick={closeMenu}>Contact</NavLink>
            <NavLink className="btn btn-fruit ms-lg-3" to="/contact" onClick={closeMenu}>Pesan sekarang <span aria-hidden="true">↗</span></NavLink>
          </div>
        </div>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <NavLink className="brand-mark footer-brand" to="/">
          <span className="brand-fruit" aria-hidden="true">✿</span>
          <span>segar<span className="brand-light">.hari</span></span>
        </NavLink>
        <p>Diracik segar, untuk hari yang lebih cerah.</p>
        <span className="footer-note">© 2026 Segar.Hari · Dibuat dengan cinta dan buah.</span>
      </div>
    </footer>
  )
}

function PageIntro({ eyebrow, title, description }) {
  return (
    <section className="page-intro">
      <div className="container text-center">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  )
}

function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> SEGAR SETIAP HARI</span>
            <h1>Isi harimu<br />dengan <span>yang segar.</span></h1>
            <p>Buah pilihan, diracik sepenuh hati. Teman segar untuk menemani langkah kecil dan hari besar kamu.</p>
            <div className="d-flex flex-wrap align-items-center gap-3">
              <a className="btn btn-fruit btn-lg" href="#menu">Kenalan dengan menu <span aria-hidden="true">↓</span></a>
              <span className="hero-caption"><span aria-hidden="true">✳</span> 100% diracik saat dipesan</span>
            </div>
            <div className="hero-proof">
              <div className="proof-icons" aria-hidden="true"><span>🍊</span><span>🍓</span><span>🍍</span></div>
              <span>Dibuat dari buah pilihan, bukan perisa.</span>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-image-frame">
              <img
                src="https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=1000&q=85"
                alt="Smoothie buah segar dengan potongan buah berwarna cerah"
              />
              <span className="image-sticker sticker-top">SEGAR<br />BANGET!</span>
              <span className="image-sticker sticker-bottom"><span>✿</span> Buah asli,<br />rasa alami</span>
            </div>
            <span className="hero-spark hero-spark-one" aria-hidden="true">✳</span>
            <span className="hero-spark hero-spark-two" aria-hidden="true">✦</span>
            <div className="floating-fruit" aria-hidden="true">🍊</div>
          </div>
        </div>
      </section>

      <section className="promise-strip">
        <div className="container promise-grid">
          <div><span>01</span><p>Buah segar pilihan</p></div>
          <div><span>02</span><p>Diracik saat dipesan</p></div>
          <div><span>03</span><p>Manis alami, no drama</p></div>
        </div>
      </section>

      <section className="menu-section section-space" id="menu">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">DARI DAPUR KECIL KAMI</span><h2>Segar favoritmu.</h2></div>
            <p>Setiap gelas diracik satu per satu dari buah segar. Pilih teman harimu.</p>
          </div>
          <div className="row g-4">
            {products.map((product) => (
              <div className="col-md-4" key={product.name}>
                <article className="product-card">
                  <div className={`product-photo ${product.color}`}>
                    <img
                      src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=800&q=80`}
                      alt={`${product.name}, minuman buah segar`}
                      loading="lazy"
                    />
                    <span className="product-badge">{product.badge}</span>
                    <span className="product-fruit" aria-hidden="true">{product.color === 'pink' ? '🍓' : product.color === 'green' ? '🍏' : '🍊'}</span>
                  </div>
                  <div className="product-info">
                    <div><h3>{product.name}</h3><p>{product.detail}</p></div>
                    <span className="product-price">{product.price}</span>
                  </div>
                  <NavLink className="product-link" to="/contact">Tanya menu ini <span aria-hidden="true">↗</span></NavLink>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="story-section">
        <div className="container story-grid">
          <div className="story-photo">
            <img
              src="https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=1000&q=85"
              alt="Buah-buahan segar pilihan untuk diracik menjadi minuman"
              loading="lazy"
            />
            <span className="story-stamp">PILIHAN<br />HARI INI</span>
          </div>
          <div className="story-copy">
            <span className="eyebrow">CERITA SEGAR.HARI</span>
            <h2>Yang sederhana,<br /><span>dibuat sepenuh hati.</span></h2>
            <p>Kami memulai Segar.Hari dengan satu ide: minuman enak bisa dibuat dari bahan yang kita kenal. Buah segar, resep jujur, dan waktu untuk meracik dengan baik.</p>
            <NavLink className="story-link" to="/team">Kenalan dengan team kami <span aria-hidden="true">→</span></NavLink>
          </div>
        </div>
      </section>

      <section className="closing-section">
        <div className="container closing-inner">
          <span className="closing-fruit" aria-hidden="true">🍋</span>
          <span className="eyebrow">HARI INI MILIKMU</span>
          <h2>Yuk, bikin harimu<br /><span>lebih segar.</span></h2>
          <p>Masih penasaran sama rasa yang lain? Ceritakan seleramu, kami bantu pilihkan.</p>
          <NavLink className="btn btn-fruit" to="/contact">Hubungi kami <span aria-hidden="true">↗</span></NavLink>
        </div>
      </section>
    </>
  )
}

function TeamPage() {
  return (
    <>
      <PageIntro
        eyebrow="ORANG DI BALIK SETIAP GELAS"
        title={<>Kecil team-nya,<br /><span>besar cintanya.</span></>}
        description="Kami percaya hal baik dimulai dari orang-orang yang peduli. Ini dia team yang menyiapkan kesegaranmu."
      />
      <section className="team-section section-space">
        <div className="container">
          <div className="row g-4 justify-content-center">
            {team.map((person, index) => (
              <div className="col-md-6 col-xl-3" key={person.name}>
                <article className="team-card">
                  <div className="team-photo">
                    <img
                      src={person.image.startsWith('/') ? person.image : `https://images.unsplash.com/${person.image}?auto=format&fit=crop&w=800&q=85`}
                      alt={`Foto ${person.name}`}
                      loading="lazy"
                    />
                    <span className="team-number">0{index + 1}</span>
                  </div>
                  <div className="team-details">
                    <span className="team-role">{person.role}</span>
                    <h2>{person.name}</h2>
                    <p>{person.bio}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>
          <div className="team-note">
            <span aria-hidden="true">✿</span>
            <p>Setiap hari kami belajar meracik lebih baik—dengan buah pilihan, ide baru, dan masukan darimu.</p>
          </div>
        </div>
      </section>
      <section className="team-values">
        <div className="container values-grid">
          <div><span className="eyebrow">YANG KAMI PERCAYA</span><h2>Kesegaran itu<br /><span>soal perhatian.</span></h2></div>
          <div className="value-item"><span>01</span><div><h3>Jujur pada bahan</h3><p>Buah yang baik tidak perlu ditutupi. Kami memilih bahan segar dan meraciknya sederhana.</p></div></div>
          <div className="value-item"><span>02</span><div><h3>Hangat pada sesama</h3><p>Setiap gelas dibuat dengan perhatian yang sama, untuk siapa pun yang datang.</p></div></div>
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
  }

  return (
    <>
      <PageIntro
        eyebrow="KAMI SENANG MENDENGARNYA"
        title={<>Ada yang ingin<br /><span>kamu ceritakan?</span></>}
        description="Tanya menu, pesan untuk acara, atau sekadar bilang halo—pintu kami selalu terbuka."
      />
      <section className="contact-section section-space">
        <div className="container contact-grid">
          <div className="contact-details">
            <span className="eyebrow">SAPA KAMI</span>
            <h2>Obrolan segar<br />dimulai di sini.</h2>
            <p className="contact-lead">Punya pertanyaan tentang menu atau ingin pesan untuk momen spesial? Kirim pesan, ya.</p>
            <div className="contact-method">
              <span className="contact-icon" aria-hidden="true">✉</span>
              <div><small>EMAIL</small><a href="mailto:halo@segarhari.example">halo@segarhari.example</a></div>
            </div>
            <div className="contact-method">
              <span className="contact-icon" aria-hidden="true">◷</span>
              <div><small>JAM BALAS</small><span>Senin–Sabtu · 09.00–17.00 WIB</span></div>
            </div>
            <div className="contact-aside"><span aria-hidden="true">✳</span> Untuk saat ini, Segar.Hari adalah konsep brand untuk tugas proyek.</div>
          </div>
          <div className="contact-form-card">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="contact-name">Nama kamu</label>
                <input className="form-control" id="contact-name" name="name" type="text" placeholder="Contoh: Dita" required />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="contact-email">Alamat email</label>
                <input className="form-control" id="contact-email" name="email" type="email" placeholder="kamu@email.com" required />
              </div>
              <div className="mb-4">
                <label className="form-label" htmlFor="contact-topic">Lagi ingin apa?</label>
                <select className="form-select" id="contact-topic" name="topic" defaultValue="" required>
                  <option value="" disabled>Pilih topik pesan</option>
                  <option value="menu">Tanya menu</option>
                  <option value="order">Pesanan acara</option>
                  <option value="collaboration">Kerja sama</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="form-label" htmlFor="contact-message">Pesanmu</label>
                <textarea className="form-control" id="contact-message" name="message" rows="4" placeholder="Ceritakan sedikit, kami mendengarkan..." required />
              </div>
              <button className="btn btn-fruit w-100" type="submit">Kirim pesan <span aria-hidden="true">↗</span></button>
              {submitted && <p className="form-feedback" role="status">Terima kasih! Formulir ini masih berupa demo dan belum mengirim pesan ke server.</p>}
              <p className="form-note">Formulir demo—belum terhubung ke layanan pengiriman pesan.</p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

function NotFoundPage() {
  return (
    <PageIntro
      eyebrow="OOPS, SALAH JALAN"
      title={<>Halaman ini<br /><span>belum tersedia.</span></>}
      description="Yuk kembali ke beranda dan temukan kesegaranmu."
    />
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function AppLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App
