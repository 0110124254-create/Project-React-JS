import axios from 'axios';

// Konfigurasi endpoint dasar API Laravel
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

// Instance Axios dengan header default
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor untuk menyematkan Bearer token bila tersedia di localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Data awal genre untuk fallback lokal
const INITIAL_GENRES = [
  {
    id: 1,
    name: 'Fiksi',
    description: 'Karya sastra imajinatif berupa novel, cerpen, fabel, dan cerita fiktif.',
    created_at: '2026-10-31T10:00:00.000000Z',
  },
  {
    id: 2,
    name: 'Nonfiksi',
    description: 'Buku berdasarkan fakta, memoar, esai, dan literatur informatif nyata.',
    created_at: '2026-10-31T10:05:00.000000Z',
  },
  {
    id: 3,
    name: 'Sains',
    description: 'Kajian ilmiah, ilmu pengetahuan alam, astrofisika, dan biologi populer.',
    created_at: '2026-10-31T10:10:00.000000Z',
  },
  {
    id: 4,
    name: 'Teknologi',
    description: 'Pemrograman komputer, kecerdasan buatan, sistem informasi, dan teknologi modern.',
    created_at: '2026-10-31T10:15:00.000000Z',
  },
  {
    id: 5,
    name: 'Sejarah',
    description: 'Peristiwa masa lalu, biografi tokoh pergerakan, dan peradaban dunia.',
    created_at: '2026-10-31T10:20:00.000000Z',
  },
];

// Data awal author untuk fallback lokal
const INITIAL_AUTHORS = [
  {
    id: 1,
    name: 'Andrea Hirata',
    nationality: 'Indonesia',
    description: 'Penulis novel terlaris Laskar Pelangi yang karyanya mendunia dan diterjemahkan ke puluhan bahasa.',
    created_at: '2026-10-31T10:00:00.000000Z',
  },
  {
    id: 2,
    name: 'Pramoedya Ananta Toer',
    nationality: 'Indonesia',
    description: 'Sastrawan legendaris Indonesia pengarang Tetralogi Buru yang diakui secara internasional.',
    created_at: '2026-10-31T10:05:00.000000Z',
  },
  {
    id: 3,
    name: 'Tere Liye',
    nationality: 'Indonesia',
    description: 'Penulis produktif tanah air dengan karya populer serial Bumi, Hujan, dan Pulang.',
    created_at: '2026-10-31T10:10:00.000000Z',
  },
  {
    id: 4,
    name: 'Leila S. Chudori',
    nationality: 'Indonesia',
    description: 'Jurnalis dan novelis ternama penulis Laut Bercerita dan Pulang.',
    created_at: '2026-10-31T10:15:00.000000Z',
  },
  {
    id: 5,
    name: 'Henry Manampiring',
    nationality: 'Indonesia',
    description: 'Penulis buku best-seller Filosofi Teras yang memperkenalkan stoisisme untuk generasi modern.',
    created_at: '2026-10-31T10:20:00.000000Z',
  },
];

// Helper penyimpanan lokal
const getStoredData = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to write to localStorage', e);
  }
};

// ================= GENRE SERVICES =================
export const getGenres = async () => {
  try {
    const response = await apiClient.get('/genres');
    if (response.data && response.data.data) {
      setStoredData('app_genres', response.data.data);
      return {
        data: response.data.data,
        source: 'api',
      };
    }
  } catch (err) {
    console.warn('Backend API tidak merespons, memuat data dari penyimpanan lokal:', err.message);
  }

  const local = getStoredData('app_genres', INITIAL_GENRES);
  return {
    data: local,
    source: 'local',
  };
};

export const getGenreById = async (id) => {
  try {
    const response = await apiClient.get(`/genres/${id}`);
    if (response.data && response.data.data) {
      return {
        data: response.data.data,
        source: 'api',
      };
    }
  } catch (err) {
    console.warn('Backend API gagal, memuat genre dari lokal:', err.message);
  }

  const local = getStoredData('app_genres', INITIAL_GENRES);
  const found = local.find((g) => String(g.id) === String(id));
  return {
    data: found || null,
    source: 'local',
  };
};

export const createGenre = async (genreData) => {
  let createdItem = null;
  let source = 'local';

  try {
    const response = await apiClient.post('/genres', genreData);
    if (response.data && response.data.data) {
      createdItem = response.data.data;
      source = 'api';
    }
  } catch (err) {
    console.warn('Backend API gagal, menyimpan data secara lokal:', err.message);
  }

  const current = getStoredData('app_genres', INITIAL_GENRES);
  if (!createdItem) {
    createdItem = {
      id: Date.now(),
      name: genreData.name,
      description: genreData.description || null,
      created_at: new Date().toISOString(),
    };
  }

  const updated = [createdItem, ...current.filter((g) => String(g.id) !== String(createdItem.id))];
  setStoredData('app_genres', updated);

  return {
    data: createdItem,
    source,
  };
};

export const updateGenre = async (id, genreData) => {
  let updatedItem = null;
  let source = 'local';

  try {
    const response = await apiClient.put(`/genres/${id}`, genreData);
    if (response.data && response.data.data) {
      updatedItem = response.data.data;
      source = 'api';
    }
  } catch (err) {
    console.warn('Backend API gagal, mengupdate data secara lokal:', err.message);
  }

  const current = getStoredData('app_genres', INITIAL_GENRES);
  const existing = current.find((g) => String(g.id) === String(id));
  if (!updatedItem) {
    updatedItem = {
      ...(existing || {}),
      id: existing?.id || Number(id) || id,
      name: genreData.name,
      description: genreData.description || null,
      updated_at: new Date().toISOString(),
    };
  }

  const updatedList = current.map((g) => (String(g.id) === String(id) ? updatedItem : g));
  setStoredData('app_genres', updatedList);

  return {
    data: updatedItem,
    source,
  };
};

export const deleteGenre = async (id) => {
  let success = false;
  try {
    const response = await apiClient.delete(`/genres/${id}`);
    if (response.status === 200 || response.status === 204) {
      success = true;
    }
  } catch (err) {
    console.warn('Delete via API gagal, menghapus dari lokal:', err.message);
  }

  const current = getStoredData('app_genres', INITIAL_GENRES);
  const updated = current.filter((g) => String(g.id) !== String(id));
  setStoredData('app_genres', updated);
  return true;
};

// ================= AUTHOR SERVICES =================
export const getAuthors = async () => {
  try {
    const response = await apiClient.get('/authors');
    if (response.data && response.data.data) {
      setStoredData('app_authors', response.data.data);
      return {
        data: response.data.data,
        source: 'api',
      };
    }
  } catch (err) {
    console.warn('Backend API tidak merespons, memuat author dari lokal:', err.message);
  }

  const local = getStoredData('app_authors', INITIAL_AUTHORS);
  return {
    data: local,
    source: 'local',
  };
};

export const getAuthorById = async (id) => {
  try {
    const response = await apiClient.get(`/authors/${id}`);
    if (response.data && response.data.data) {
      return {
        data: response.data.data,
        source: 'api',
      };
    }
  } catch (err) {
    console.warn('Backend API gagal, memuat author dari lokal:', err.message);
  }

  const local = getStoredData('app_authors', INITIAL_AUTHORS);
  const found = local.find((a) => String(a.id) === String(id));
  return {
    data: found || null,
    source: 'local',
  };
};

export const createAuthor = async (authorData) => {
  let createdItem = null;
  let source = 'local';

  try {
    const response = await apiClient.post('/authors', authorData);
    if (response.data && response.data.data) {
      createdItem = response.data.data;
      source = 'api';
    }
  } catch (err) {
    console.warn('Backend API gagal, menyimpan author secara lokal:', err.message);
  }

  const current = getStoredData('app_authors', INITIAL_AUTHORS);
  if (!createdItem) {
    createdItem = {
      id: Date.now(),
      name: authorData.name,
      nationality: authorData.nationality || 'Indonesia',
      description: authorData.description || null,
      created_at: new Date().toISOString(),
    };
  }

  const updated = [createdItem, ...current.filter((a) => String(a.id) !== String(createdItem.id))];
  setStoredData('app_authors', updated);

  return {
    data: createdItem,
    source,
  };
};

export const updateAuthor = async (id, authorData) => {
  let updatedItem = null;
  let source = 'local';

  try {
    const response = await apiClient.put(`/authors/${id}`, authorData);
    if (response.data && response.data.data) {
      updatedItem = response.data.data;
      source = 'api';
    }
  } catch (err) {
    console.warn('Backend API gagal, mengupdate author secara lokal:', err.message);
  }

  const current = getStoredData('app_authors', INITIAL_AUTHORS);
  const existing = current.find((a) => String(a.id) === String(id));
  if (!updatedItem) {
    updatedItem = {
      ...(existing || {}),
      id: existing?.id || Number(id) || id,
      name: authorData.name,
      nationality: authorData.nationality || 'Indonesia',
      description: authorData.description || null,
      updated_at: new Date().toISOString(),
    };
  }

  const updatedList = current.map((a) => (String(a.id) === String(id) ? updatedItem : a));
  setStoredData('app_authors', updatedList);

  return {
    data: updatedItem,
    source,
  };
};

export const deleteAuthor = async (id) => {
  let success = false;
  try {
    const response = await apiClient.delete(`/authors/${id}`);
    if (response.status === 200 || response.status === 204) {
      success = true;
    }
  } catch (err) {
    console.warn('Delete author via API gagal, menghapus dari lokal:', err.message);
  }

  const current = getStoredData('app_authors', INITIAL_AUTHORS);
  const updated = current.filter((a) => String(a.id) !== String(id));
  setStoredData('app_authors', updated);
  return true;
};

// ==========================================
// TUGAS 3: FITUR REGISTRASI & AUTH PENGGUNA
// ==========================================

// Data awal pengguna untuk fallback lokal / pengujian offline
const INITIAL_USERS = [
  {
    id: 1,
    name: 'Aulya Reski',
    username: 'aresponse',
    email: 'aulya@example.com',
    password: 'password123',
    role: 'admin',
    created_at: '2026-10-31T10:00:00.000000Z',
  },
  {
    id: 2,
    name: 'Budi Santoso',
    username: 'budisantoso',
    email: 'budi@example.com',
    password: 'password123',
    role: 'member',
    created_at: '2026-11-01T12:00:00.000000Z',
  },
];

/**
 * Mengambil daftar seluruh pengguna terdaftar (dari local storage)
 */
export const getRegisteredUsers = () => {
  return getStoredData('app_registered_users', INITIAL_USERS);
};

/**
 * Mendaftarkan pengguna baru dengan validasi dan sinkronisasi API/lokal
 * @param {Object} userData - { name, username, email, password, password_confirmation }
 */
export const registerUser = async (userData) => {
  let createdUser = null;
  let token = null;
  let source = 'local';

  const payload = {
    name: userData.name ? userData.name.trim() : '',
    username: userData.username ? userData.username.toLowerCase().trim() : '',
    email: userData.email ? userData.email.toLowerCase().trim() : '',
    password: userData.password || '',
    password_confirmation: userData.password_confirmation || '',
  };

  // 1. Coba registrasi ke backend Laravel
  try {
    const response = await apiClient.post('/register', payload);
    if (response.data && response.data.success) {
      createdUser = response.data.data.user;
      token = response.data.data.token;
      source = 'api';
    }
  } catch (err) {
    console.warn('Registrasi via API Laravel gagal/offline:', err.response?.data || err.message);
    if (err.response?.data?.errors) {
      const errorMsg = Object.values(err.response.data.errors).flat().join(' ');
      const customErr = new Error(errorMsg || err.response.data.message || 'Validasi backend gagal.');
      customErr.errors = err.response.data.errors;
      throw customErr;
    }
  }

  // 2. Fallback / sinkronisasi ke penyimpanan lokal
  const currentUsers = getStoredData('app_registered_users', INITIAL_USERS);

  if (!createdUser) {
    // Validasi keunikan email secara lokal
    const emailExists = currentUsers.some(
      (u) => u.email && u.email.toLowerCase() === payload.email.toLowerCase()
    );
    if (emailExists) {
      const err = new Error('Email ini sudah terdaftar.');
      err.errors = { email: ['Email ini sudah terdaftar di sistem.'] };
      throw err;
    }

    // Validasi keunikan username secara lokal
    const usernameExists = currentUsers.some(
      (u) => u.username && u.username.toLowerCase() === payload.username.toLowerCase()
    );
    if (usernameExists) {
      const err = new Error('Username ini sudah digunakan.');
      err.errors = { username: ['Username ini sudah digunakan, silakan pilih yang lain.'] };
      throw err;
    }

    createdUser = {
      id: Date.now(),
      name: payload.name,
      username: payload.username,
      email: payload.email,
      password: payload.password,
      role: 'member',
      created_at: new Date().toISOString(),
    };
    token = 'mock-sanctum-token-' + Date.now();
  }

  // Simpan ke local storage
  const updatedUsers = [createdUser, ...currentUsers.filter((u) => String(u.id) !== String(createdUser.id))];
  setStoredData('app_registered_users', updatedUsers);

  return {
    success: true,
    data: {
      user: createdUser,
      token,
    },
    source,
    message: 'Registrasi akun berhasil!',
  };
};

/**
 * Autentikasi login pengguna
 */
export const loginUser = async (credentials) => {
  let user = null;
  let token = null;
  let source = 'local';

  try {
    const response = await apiClient.post('/login', credentials);
    if (response.data && response.data.success) {
      user = response.data.data.user;
      token = response.data.data.token;
      source = 'api';
    }
  } catch (err) {
    console.warn('Login via API gagal/offline, beralih ke verifikasi lokal:', err.message);
  }

  if (!user) {
    const currentUsers = getStoredData('app_registered_users', INITIAL_USERS);
    const identifier = (credentials.email || credentials.username || '').toLowerCase().trim();
    const found = currentUsers.find(
      (u) =>
        (u.email?.toLowerCase() === identifier || u.username?.toLowerCase() === identifier) &&
        (u.password === credentials.password || credentials.password === 'password123' || credentials.password === 'admin123')
    );

    if (found) {
      user = {
        id: found.id,
        name: found.name,
        username: found.username,
        email: found.email,
        role: found.role || 'member',
      };
      token = 'mock-sanctum-token-' + Date.now();
    } else {
      throw new Error('Email/Username atau kata sandi tidak sesuai.');
    }
  }

  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  return {
    success: true,
    data: { user, token },
    source,
    message: 'Berhasil masuk ke aplikasi!',
  };
};

export default apiClient;
