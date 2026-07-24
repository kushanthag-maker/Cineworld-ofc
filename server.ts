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

app.use(cors());
app.use(express.json());

// Set default Content-Type header for all API responses
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Initial Seed Movies
const initialSeedMovies = [
  {
    id: 'ben-10-af-s3',
    title: 'Ben 10: Alien Force Season 03',
    originalTitle: 'Ben 10: Alien Force Season 03 – සිංහල හඩකැවූ',
    releaseYear: 2024,
    duration: '17 Episodes',
    rating: 8.8,
    genres: ['Animation', 'Sinhala Cartoon', 'Action', 'Sci-Fi'],
    director: 'Cartoon Network / Sinhala Cartoons',
    cast: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
    description: 'Ben Tennyson is back with upgraded alien powers in full Sinhala Dubbed HD audio. Watch all 17 episodes online or download with high-speed direct server links.',
    posterUrl: 'https://sinhalacartoons.com/wp-content/uploads/2026/04/SEASON-01-3.png',
    backdropUrl: 'https://sinhalacartoons.com/wp-content/uploads/2026/04/SEASON-01-3.png',
    streamUrl: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E1.mp4',
    category: 'Sinhala Dubbed',
    language: 'Sinhala Dubbed (සිංහල)',
    hasSinhalaSub: true,
    quality: '1080p Full HD',
    viewsCount: 1420,
    downloadsCount: 890,
    episodes: [
      { episode: '01', title: 'Episode 01 - Vengeance of Vilgax Part 1', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E1.mp4' },
      { episode: '02', title: 'Episode 02 - Vengeance of Vilgax Part 2', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E2.mp4' },
      { episode: '03', title: 'Episode 03 - Inferno', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E3.mp4' },
      { episode: '04', title: 'Episode 04 - Simple', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E4.mp4' },
      { episode: '05', title: 'Episode 05 - Vreedle Vreedle', stream_url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E5.mp4' }
    ],
    downloadOptions: [
      {
        id: 'opt-b10-1',
        quality: '1080p Episode 01 Direct',
        resolution: '1920x1080',
        size: '180 MB',
        format: 'MP4 Direct',
        downloadUrl: 'https://dl.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E1.mp4',
        server2Url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E1.mp4',
        server1Name: 'Server 1 High-Speed R2',
        server2Name: 'Server 2 Direct CDN'
      },
      {
        id: 'opt-b10-2',
        quality: '1080p Episode 02 Direct',
        resolution: '1920x1080',
        size: '185 MB',
        format: 'MP4 Direct',
        downloadUrl: 'https://dl.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E2.mp4',
        server2Url: 'https://cdn.sinhalacartoons.com/Ben-10-Aliem-Force-S3//B10S3E2.mp4',
        server1Name: 'Server 1 High-Speed R2',
        server2Name: 'Server 2 Direct CDN'
      }
    ],
    createdAt: new Date().toISOString()
  }
];

let moviesCache: any[] = [...initialSeedMovies];
let requestsCache: any[] = [];
let noticesCache: any[] = [
  {
    id: 'n1',
    title: 'NEW AUTOMATIC SINHALA CARTOONS & TV SHOWS ADDED!',
    content: 'Enjoy direct high-speed downloads & direct streaming for Ben 10, Avatar, Scooby-Doo, Tom & Jerry and more in Sinhala Dubbed HD!',
    type: 'success',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

// MongoDB Client
let dbClient: MongoClient | null = null;
async function connectToMongo() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) return null;
  try {
    if (!dbClient) {
      dbClient = new MongoClient(mongoUri);
      await dbClient.connect();
      console.log('Successfully connected to MongoDB Atlas!');
    }
    return dbClient.db('cineworld');
  } catch (err) {
    console.warn('MongoDB connection warning:', err);
    return null;
  }
}

// Initialize & Sync Mongo Data if available
async function initDb() {
  const db = await connectToMongo();
  if (db) {
    try {
      const moviesCol = db.collection('movies');
      const count = await moviesCol.countDocuments();
      if (count === 0) {
        await moviesCol.insertMany(initialSeedMovies);
      } else {
        const storedMovies = await moviesCol.find({}).toArray();
        moviesCache = storedMovies;
      }

      const requestsCol = db.collection('requests');
      requestsCache = await requestsCol.find({}).toArray();

      const noticesCol = db.collection('notices');
      const noticeCount = await noticesCol.countDocuments();
      if (noticeCount > 0) {
        noticesCache = await noticesCol.find({}).toArray();
      }
    } catch (e) {
      console.error('Error initializing Mongo DB collections:', e);
    }
  }
}

initDb();

// ==================== MOVIES API ENDPOINTS ====================

// GET /api/movies
app.get('/api/movies', async (req, res) => {
  try {
    const db = await connectToMongo();
    if (db) {
      const dbMovies = await db.collection('movies').find({}).toArray();
      if (dbMovies && dbMovies.length > 0) {
        moviesCache = dbMovies;
      }
    }
    return res.json(moviesCache);
  } catch (err: any) {
    return res.json(moviesCache);
  }
});

// POST /api/movies
app.post('/api/movies', async (req, res) => {
  try {
    const newMovie = {
      ...req.body,
      id: req.body.id || 'm-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    moviesCache = [newMovie, ...moviesCache.filter((m) => m.id !== newMovie.id)];

    const db = await connectToMongo();
    if (db) {
      await db.collection('movies').replaceOne({ id: newMovie.id }, newMovie, { upsert: true });
    }
    return res.json({ success: true, movie: newMovie });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/movies/:id
app.put('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = req.body;
    moviesCache = moviesCache.map((m) => (m.id === id ? { ...m, ...updated } : m));

    const db = await connectToMongo();
    if (db) {
      await db.collection('movies').updateOne({ id }, { $set: updated });
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/movies/:id
app.delete('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    moviesCache = moviesCache.filter((m) => m.id !== id);

    const db = await connectToMongo();
    if (db) {
      await db.collection('movies').deleteOne({ id });
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== ZANTA SINHALA CARTOONS API INTEGRATION ====================
const ZANTA_API_KEY = 'zan_FLUs8y9T_fcz7cgi12p';

async function importCartoonToDb(searchItem: any, dlDetails: any) {
  const rawUrl = searchItem.url || searchItem.link || '';
  if (!rawUrl) return null;

  const movieId = 'zanta-' + Buffer.from(rawUrl).toString('hex').slice(-20);

  const episodes = dlDetails?.episodes || [];
  const downloadLinks = dlDetails?.download_links || [];

  const streamUrl = episodes[0]?.stream_url || downloadLinks[0]?.final_link || searchItem.thumbnail || '';

  // Format Download Options for each episode or full series
  let downloadOptions: any[] = [];

  if (episodes.length > 0) {
    downloadOptions = episodes.map((ep: any, idx: number) => {
      const epNum = ep.episode || String(idx + 1).padStart(2, '0');
      const s1Url = ep.stream_url;
      const s2Url = downloadLinks[0]?.final_link || s1Url;

      return {
        id: `opt-ep-${idx + 1}`,
        quality: `Episode ${epNum} HD (${ep.title || 'Sinhala Dubbed'})`,
        resolution: '1080p HD',
        size: '150 - 280 MB',
        format: 'MP4 Direct',
        downloadUrl: s1Url,
        server2Url: s2Url,
        server1Name: 'Server 1 CDN Direct',
        server2Name: 'Server 2 Cloudflare R2'
      };
    });
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
  } else {
    downloadOptions = [
      {
        id: 'opt-default',
        quality: '1080p Full HD',
        resolution: '1920x1080',
        size: '350 MB',
        format: 'MP4 Direct',
        downloadUrl: streamUrl,
        server2Url: streamUrl,
        server1Name: 'Server 1 Direct',
        server2Name: 'Server 2 Mirror'
      }
    ];
  }

  const cleanTitle = (dlDetails?.title || searchItem.title || 'Sinhala Cartoon Series')
    .replace(/–\s*සිංහල\s*හඩකැවූ.*/i, '')
    .replace(/-\s*Sinhala Cartoons.*/i, '')
    .replace(/Sinhala Dubbed.*/i, '')
    .trim();

  const formattedEpisodes = episodes.map((ep: any, idx: number) => ({
    episode: ep.episode || String(idx + 1).padStart(2, '0'),
    title: ep.title || `Episode ${ep.episode || idx + 1}`,
    stream_url: ep.stream_url
  }));

  const movieObj = {
    id: movieId,
    title: cleanTitle,
    originalTitle: searchItem.title,
    releaseYear: 2024,
    duration: dlDetails?.total_episodes ? `${dlDetails.total_episodes} Episodes` : formattedEpisodes.length > 0 ? `${formattedEpisodes.length} Episodes` : 'Complete Cartoon Series',
    rating: parseFloat(searchItem.rating) || 8.5,
    genres: ['Animation', 'Sinhala Cartoon', 'Action', 'Family'],
    director: 'Sinhala Cartoons LK',
    cast: ['Sinhala Dubbing Team'],
    description: `${cleanTitle} - Sinhala Dubbed Cartoon / Anime Series with online HD streaming & high-speed direct downloads. Total Episodes: ${dlDetails?.total_episodes || formattedEpisodes.length || 1}.`,
    posterUrl: searchItem.thumbnail,
    backdropUrl: searchItem.thumbnail,
    streamUrl: streamUrl,
    category: 'Sinhala Dubbed',
    language: 'Sinhala Dubbed (සිංහල)',
    hasSinhalaSub: false,
    quality: searchItem.quality || '1080p HD',
    viewsCount: Math.floor(Math.random() * 800) + 400,
    downloadsCount: Math.floor(Math.random() * 500) + 300,
    downloadOptions: downloadOptions,
    episodes: formattedEpisodes,
    createdAt: new Date().toISOString()
  };

  moviesCache = [movieObj, ...moviesCache.filter((m) => m.id !== movieId)];

  const db = await connectToMongo();
  if (db) {
    await db.collection('movies').replaceOne({ id: movieId }, movieObj, { upsert: true });
  }

  return movieObj;
}

// Automatic continuous background sync routine
async function runAutoSyncTask() {
  console.log('[AUTO-SYNC] Starting automatic cartoon catalog sync...');
  const keywords = [
    'ben 10', 'tom and jerry', 'scooby', 'avatar', 'dora', 'naruto',
    'pokemon', 'dragon ball', 'tintin', 'batman', 'spiderman', 'sinhala', 'dubbed', 'cartoons'
  ];
  let importedCount = 0;
  for (const kw of keywords) {
    try {
      const searchRes = await fetch(`https://api.zanta-mini.store/api/slcartoons/search?apiKey=${ZANTA_API_KEY}&text=${encodeURIComponent(kw)}`);
      const searchText = await searchRes.text();
      const searchJson = JSON.parse(searchText);

      if (searchJson.success && Array.isArray(searchJson.results)) {
        for (const item of searchJson.results.slice(0, 10)) {
          try {
            const dlRes = await fetch(`https://api.zanta-mini.store/api/slcartoons/dl?apiKey=${ZANTA_API_KEY}&text=${encodeURIComponent(item.url)}`);
            const dlText = await dlRes.text();
            const dlJson = JSON.parse(dlText);
            if (dlJson.success) {
              await importCartoonToDb(item, dlJson.results);
              importedCount++;
            }
          } catch (e) {
            // ignore individual item error
          }
        }
      }
    } catch (err) {
      // ignore kw error
    }
  }
  console.log(`[AUTO-SYNC] Complete. Synced ${importedCount} items into catalog.`);
}

// Trigger initial sync after 3 seconds, and then every 5 minutes
setTimeout(() => {
  runAutoSyncTask().catch((err) => console.error('Initial auto sync error:', err));
}, 3000);

setInterval(() => {
  runAutoSyncTask().catch((err) => console.error('Periodic auto sync error:', err));
}, 5 * 60 * 1000);

// GET /api/cartoons/search
app.get('/api/cartoons/search', async (req, res) => {
  try {
    const query = (req.query.text as string) || 'ben 10';
    const apiUrl = `https://api.zanta-mini.store/api/slcartoons/search?apiKey=${ZANTA_API_KEY}&text=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return res.json(data);
    } catch (parseErr) {
      return res.status(502).json({ success: false, message: 'External API returned non-JSON data.', raw: text.slice(0, 100) });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/cartoons/dl
app.get('/api/cartoons/dl', async (req, res) => {
  try {
    const url = req.query.url as string;
    if (!url) return res.status(400).json({ error: 'URL parameter is required' });

    const apiUrl = `https://api.zanta-mini.store/api/slcartoons/dl?apiKey=${ZANTA_API_KEY}&text=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return res.json(data);
    } catch (parseErr) {
      return res.status(502).json({ success: false, message: 'External API returned non-JSON data.' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/cartoons/import
app.post('/api/cartoons/import', async (req, res) => {
  try {
    const { item, details } = req.body;
    if (!item) return res.status(400).json({ error: 'Item parameter is required' });

    let dlData = details;
    if (!dlData && item.url) {
      try {
        const dlRes = await fetch(`https://api.zanta-mini.store/api/slcartoons/dl?apiKey=${ZANTA_API_KEY}&text=${encodeURIComponent(item.url)}`);
        const dlText = await dlRes.text();
        const json = JSON.parse(dlText);
        if (json.success) {
          dlData = json.results;
        }
      } catch (e) {
        console.warn('Could not fetch dl details:', e);
      }
    }

    const imported = await importCartoonToDb(item, dlData);
    return res.json({ success: true, movie: imported });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/cartoons/auto-sync
app.post('/api/cartoons/auto-sync', async (req, res) => {
  try {
    const keywords = (req.body.keywords as string[]) || ['ben 10', 'tom and jerry', 'scooby', 'avatar', 'dora', 'sinhala'];
    let totalImported = 0;

    for (const kw of keywords) {
      try {
        const searchRes = await fetch(`https://api.zanta-mini.store/api/slcartoons/search?apiKey=${ZANTA_API_KEY}&text=${encodeURIComponent(kw)}`);
        const searchText = await searchRes.text();
        const searchJson = JSON.parse(searchText);

        if (searchJson.success && Array.isArray(searchJson.results)) {
          for (const item of searchJson.results.slice(0, 5)) {
            try {
              const dlRes = await fetch(`https://api.zanta-mini.store/api/slcartoons/dl?apiKey=${ZANTA_API_KEY}&text=${encodeURIComponent(item.url)}`);
              const dlText = await dlRes.text();
              const dlJson = JSON.parse(dlText);
              if (dlJson.success) {
                await importCartoonToDb(item, dlJson.results);
                totalImported++;
              }
            } catch (e) {
              console.warn(`Failed to process item ${item.title}:`, e);
            }
          }
        }
      } catch (kwErr) {
        console.warn(`Failed search for keyword ${kw}:`, kwErr);
      }
    }

    return res.json({ success: true, importedCount: totalImported, totalCached: moviesCache.length });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Requests API
app.get('/api/requests', (req, res) => res.json(requestsCache));
app.post('/api/requests', async (req, res) => {
  const newReq = { ...req.body, id: 'req-' + Date.now(), createdAt: new Date().toISOString() };
  requestsCache = [newReq, ...requestsCache];
  const db = await connectToMongo();
  if (db) await db.collection('requests').insertOne(newReq);
  return res.json({ success: true, request: newReq });
});

// Notices API
app.get('/api/notices', (req, res) => res.json(noticesCache));
app.post('/api/notices', async (req, res) => {
  const newNotice = { ...req.body, id: 'n-' + Date.now(), createdAt: new Date().toISOString() };
  noticesCache = [newNotice, ...noticesCache];
  const db = await connectToMongo();
  if (db) await db.collection('notices').insertOne(newNotice);
  return res.json({ success: true, notice: newNotice });
});

// Catch-all route to serve SPA or fallback
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'Endpoint not found' });
  }
  next();
});

export { app };

if (process.env.START_SERVER === 'true') {
  app.listen(PORT, () => {
    console.log(`CINEWORLD Express Server running on port ${PORT}`);
  });
}



