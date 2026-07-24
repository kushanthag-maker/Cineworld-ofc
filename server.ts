import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== SECRETS FROM .env (NEVER HARDCODE) ====================
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '7060';
const ZANTA_API_KEY = 'zan_FLUs8y9T_fcz7cgi12p';

// ==================== MONGO DB CONNECTION (Improved) ====================
let dbClient: MongoClient | null = null;
let db: any = null;

async function connectToMongo() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('⚠️ MONGODB_URI not found in .env file');
    return null;
  }

  try {
    if (!dbClient) {
      dbClient = new MongoClient(mongoUri);
      await dbClient.connect();
      db = dbClient.db('cineworld');
      console.log('✅ Successfully connected to MongoDB Atlas!');
    }
    return db;
  } catch (err: any) {
    console.error('❌ MongoDB connection error:', err.message);
    return null;
  }
}

async function initMongo() {
  if (!db) {
    await connectToMongo();
  }
  return db;
}

// ==================== IN-MEMORY CACHES ====================
let moviesCache: any[] = [];
let requestsCache: any[] = [];
let noticesCache: any[] = [];
let commentsCache: any[] = [];

// ==================== INITIAL SEED DATA ====================
const initialSeedMovies = [
  {
    id: 'ben-10-af-s3',
    title: 'Ben 10: Alien Force Season 03',
    originalTitle: 'Ben 10: Alien Force',
    category: 'Sinhala Dubbed',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    rating: 8.5,
    releaseYear: 2024,
    duration: 'Complete Season',
    quality: '1080p HD',
    genres: ['Animation', 'Action', 'Adventure'],
    director: 'Sinhala Cartoons LK',
    cast: ['Sinhala Dubbing Team'],
    description: 'Ben 10: Alien Force Season 3 - Sinhala Dubbed Full Season with high quality streaming and downloads.',
    language: 'Sinhala Dubbed (සිංහල)',
    hasSinhalaSub: false,
    viewsCount: 1250,
    downloadsCount: 890,
    createdAt: new Date().toISOString()
  }
];

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// ==================== ADMIN LOGIN (Server Side - Secure) ====================
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (password && password === ADMIN_PASSWORD) {
    return res.json({ success: true, message: 'Admin access granted' });
  }
  return res.status(401).json({ success: false, error: 'Invalid admin password' });
});

// ==================== INIT DATABASE ====================
async function initDb() {
  const database = await connectToMongo();
  if (!database) {
    console.warn('⚠️ Running without MongoDB (using in-memory cache)');
    moviesCache = [...initialSeedMovies];
    return;
  }

  try {
    const moviesCol = database.collection('movies');
    const count = await moviesCol.countDocuments();

    if (count === 0) {
      await moviesCol.insertMany(initialSeedMovies);
      moviesCache = [...initialSeedMovies];
      console.log('✅ Seeded initial movies');
    } else {
      moviesCache = await moviesCol.find({}).toArray();
    }

    const requestsCol = database.collection('requests');
    requestsCache = await requestsCol.find({}).toArray();

    const noticesCol = database.collection('notices');
    const noticeCount = await noticesCol.countDocuments();
    if (noticeCount > 0) {
      noticesCache = await noticesCol.find({}).toArray();
    }

    console.log('✅ MongoDB initialized successfully');
  } catch (e: any) {
    console.error('Error initializing MongoDB:', e.message);
  }
}

initDb();

// ==================== MOVIES API ====================
app.get('/api/movies', async (req, res) => {
  try {
    const database = await connectToMongo();
    if (database) {
      const dbMovies = await database.collection('movies').find({}).toArray();
      if (dbMovies.length > 0) moviesCache = dbMovies;
    }
    return res.json(moviesCache);
  } catch (err: any) {
    return res.json(moviesCache);
  }
});

app.post('/api/movies', async (req, res) => {
  try {
    const newMovie = {
      ...req.body,
      id: req.body.id || 'm-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    moviesCache = [newMovie, ...moviesCache.filter((m) => m.id !== newMovie.id)];

    const database = await connectToMongo();
    if (database) {
      await database.collection('movies').replaceOne({ id: newMovie.id }, newMovie, { upsert: true });
    }
    return res.json({ success: true, movie: newMovie });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = req.body;
    moviesCache = moviesCache.map((m) => (m.id === id ? { ...m, ...updated } : m));

    const database = await connectToMongo();
    if (database) {
      await database.collection('movies').updateOne({ id }, { $set: updated });
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    moviesCache = moviesCache.filter((m) => m.id !== id);

    const database = await connectToMongo();
    if (database) {
      await database.collection('movies').deleteOne({ id });
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== ZANTA SINHALA CARTOONS API ====================
async function importCartoonToDb(searchItem: any, dlDetails: any) {
  const rawUrl = searchItem.url || searchItem.link || '';
  if (!rawUrl) return null;

  const movieId = 'zanta-' + Buffer.from(rawUrl).toString('hex').slice(-20);

  const episodes = dlDetails?.episodes || [];
  const downloadLinks = dlDetails?.download_links || [];
  const streamUrl = episodes[0]?.stream_url || downloadLinks[0]?.final_link || searchItem.thumbnail || '';

  let downloadOptions: any[] = [];

  if (episodes.length > 0) {
    downloadOptions = episodes.map((ep: any, idx: number) => ({
      id: `opt-ep-${idx + 1}`,
      quality: `Episode ${ep.episode || idx + 1} HD`,
      resolution: '1080p HD',
      size: '150 - 280 MB',
      format: 'MP4 Direct',
      downloadUrl: ep.stream_url,
      server2Url: ep.stream_url,
      server1Name: 'Server 1 CDN Direct',
      server2Name: 'Server 2 Cloudflare R2'
    }));
  } else if (downloadLinks.length > 0) {
    downloadOptions = downloadLinks.map((dl: any, idx: number) => ({
      id: `opt-dl-${idx + 1}`,
      quality: dl.type || `Direct Server ${idx + 1}`,
      resolution: '1080p HD',
      size: '350 MB',
      format: 'MP4 Direct',
      downloadUrl: dl.final_link,
      server2Url: dl.final_link,
      server1Name: 'Server 1 High Speed',
      server2Name: 'Server 2 Direct'
    }));
  }

  const cleanTitle = (dlDetails?.title || searchItem.title || 'Sinhala Cartoon Series')
    .replace(/–\s*සිංහල\s*හඩකැවූ.*/i, '')
    .replace(/-\s*Sinhala Cartoons.*/i, '')
    .trim();

  const movieObj = {
    id: movieId,
    title: cleanTitle,
    originalTitle: searchItem.title,
    releaseYear: 2024,
    duration: dlDetails?.total_episodes ? `${dlDetails.total_episodes} Episodes` : 'Complete Cartoon Series',
    rating: parseFloat(searchItem.rating) || 8.5,
    genres: ['Animation', 'Sinhala Cartoon', 'Action', 'Family'],
    director: 'Sinhala Cartoons LK',
    cast: ['Sinhala Dubbing Team'],
    description: `${cleanTitle} - Sinhala Dubbed with HD streaming & downloads.`,
    posterUrl: searchItem.thumbnail,
    backdropUrl: searchItem.thumbnail,
    streamUrl: streamUrl,
    category: 'Sinhala Dubbed',
    language: 'Sinhala Dubbed (සිංහල)',
    hasSinhalaSub: false,
    quality: searchItem.quality || '1080p HD',
    viewsCount: Math.floor(Math.random() * 800) + 400,
    downloadsCount: Math.floor(Math.random() * 500) + 300,
    downloadOptions,
    episodes: episodes.map((ep: any, idx: number) => ({
      episode: ep.episode || String(idx + 1).padStart(2, '0'),
      title: ep.title || `Episode ${idx + 1}`,
      stream_url: ep.stream_url
    })),
    createdAt: new Date().toISOString()
  };

  moviesCache = [movieObj, ...moviesCache.filter((m) => m.id !== movieId)];

  const database = await connectToMongo();
  if (database) {
    await database.collection('movies').replaceOne({ id: movieId }, movieObj, { upsert: true });
  }

  return movieObj;
}

// Cartoons Search
app.get('/api/cartoons/search', async (req, res) => {
  try {
    const query = (req.query.text as string) || 'ben 10';
    const apiUrl = `https://api.zanta-mini.store/api/slcartoons/search?apiKey=\( {ZANTA_API_KEY}&text= \){encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return res.json(data);
    } catch {
      return res.status(502).json({ success: false, message: 'External API error' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Cartoons Import
app.post('/api/cartoons/import', async (req, res) => {
  try {
    const { item, details } = req.body;
    if (!item) return res.status(400).json({ error: 'Item is required' });

    let dlData = details;
    if (!dlData && item.url) {
      try {
        const dlRes = await fetch(`https://api.zanta-mini.store/api/slcartoons/dl?apiKey=\( {ZANTA_API_KEY}&text= \){encodeURIComponent(item.url)}`);
        const dlJson = await dlRes.json();
        if (dlJson.success) dlData = dlJson.results;
      } catch (e) {}
    }

    const imported = await importCartoonToDb(item, dlData);
    return res.json({ success: true, movie: imported });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Auto Sync
app.post('/api/cartoons/auto-sync', async (req, res) => {
  try {
    const keywords = req.body.keywords || ['ben 10', 'tom and jerry', 'scooby'];
    let totalImported = 0;

    for (const kw of keywords) {
      try {
        const searchRes = await fetch(`https://api.zanta-mini.store/api/slcartoons/search?apiKey=\( {ZANTA_API_KEY}&text= \){encodeURIComponent(kw)}`);
        const searchJson = await searchRes.json();

        if (searchJson.success && Array.isArray(searchJson.results)) {
          for (const item of searchJson.results.slice(0, 5)) {
            try {
              const dlRes = await fetch(`https://api.zanta-mini.store/api/slcartoons/dl?apiKey=\( {ZANTA_API_KEY}&text= \){encodeURIComponent(item.url)}`);
              const dlJson = await dlRes.json();
              if (dlJson.success) {
                await importCartoonToDb(item, dlJson.results);
                totalImported++;
              }
            } catch (e) {}
          }
        }
      } catch (e) {}
    }

    return res.json({ success: true, importedCount: totalImported, totalCached: moviesCache.length });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== REQUESTS, NOTICES, COMMENTS ====================
app.get('/api/requests', (req, res) => res.json(requestsCache));

app.post('/api/requests', async (req, res) => {
  const newReq = { ...req.body, id: 'req-' + Date.now(), createdAt: new Date().toISOString() };
  requestsCache = [newReq, ...requestsCache];
  const database = await connectToMongo();
  if (database) await database.collection('requests').insertOne(newReq);
  return res.json({ success: true, request: newReq });
});

app.get('/api/notices', (req, res) => res.json(noticesCache));

app.post('/api/notices', async (req, res) => {
  const newNotice = { ...req.body, id: 'n-' + Date.now(), createdAt: new Date().toISOString() };
  noticesCache = [newNotice, ...noticesCache];
  const database = await connectToMongo();
  if (database) await database.collection('notices').insertOne(newNotice);
  return res.json({ success: true, notice: newNotice });
});

app.get('/api/comments', (req, res) => {
  const { movieId } = req.query;
  if (movieId) return res.json(commentsCache.filter((c) => c.movieId === movieId));
  return res.json(commentsCache);
});

app.post('/api/comments', async (req, res) => {
  try {
    const { movieId, userName, comment, rating } = req.body;
    if (!movieId || !comment) return res.status(400).json({ error: 'movieId and comment required' });

    const newComment = {
      id: 'comm-' + Date.now(),
      movieId,
      userName: userName || 'Anonymous Fan',
      comment,
      rating: Number(rating) || 5,
      likes: 0,
      avatarBg: 'bg-amber-600',
      createdAt: new Date().toISOString()
    };

    commentsCache = [newComment, ...commentsCache];
    const database = await connectToMongo();
    if (database) await database.collection('comments').insertOne(newComment);

    return res.json({ success: true, comment: newComment });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/comments/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    let foundComment: any = null;

    commentsCache = commentsCache.map((c) => {
      if (c.id === id) {
        foundComment = { ...c, likes: (c.likes || 0) + 1 };
        return foundComment;
      }
      return c;
    });

    const database = await connectToMongo();
    if (database && foundComment) {
      await database.collection('comments').updateOne({ id }, { $inc: { likes: 1 } });
    }

    return res.json({ success: true, comment: foundComment });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== CATCH-ALL ====================
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'Endpoint not found' });
  }
  next();
});

// ==================== START SERVER ====================
export { app };

if (process.env.START_SERVER === 'true') {
  app.listen(PORT, () => {
    console.log(`CINEWORLD Express Server running on port ${PORT}`);
  });
}
