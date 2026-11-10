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

export default apiClient;
