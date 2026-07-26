import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialMovies } from './src/data/initialMovies';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Maximum Security Configurations
app.disable('x-powered-by');
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '100kb' })); // Restrict payload size against Denial of Service

// Comprehensive Security Headers & Data Protection
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Anti-Spam & Rate Limiter
const ipRequestLogs = new Map<string, number[]>();
const rateLimitShield = (limitCount = 15, windowMs = 60000) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.ip || '127.0.0.1';
    const key = `${ip}:${req.path}`;
    const now = Date.now();
    const timestamps = (ipRequestLogs.get(key) || []).filter(t => now - t < windowMs);

    if (timestamps.length >= limitCount) {
      return res.status(429).json({ success: false, error: 'Too many requests. Anti-spam shield active. Please try again in 1 minute.' });
    }

    timestamps.push(now);
    ipRequestLogs.set(key, timestamps);
    next();
  };
};

// Input Sanitizer for anti-XSS security
const sanitizeText = (input: any): string => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

// Initial Seed Movies
const initialSeedMovies = initialMovies;

let moviesCache: any[] = [...initialSeedMovies];
let requestsCache: any[] = [];
let noticesCache: any[] = [
  {
    id: 'n1',
    title: 'WELCOME TO CINEWORLD LK - SINHALA MOVIES & CARTOONS CINEMA',
    content: 'Enjoy high-speed direct downloads & streaming for Ben 10, Cartoons, and Sinhala Dubbed Movies in 1080p HD!',
    type: 'success',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

let commentsCache: any[] = [
  {
    id: 'c1',
    movieId: 'ben-10-af-s3',
    userName: 'Kasun Perera',
    comment: 'Supiri!! Ben 10 Alien Force Season 3 full hd audio ekka thiyenawa. Episode 1 to 17 okkoma down karagaththa. TFS admin!',
    rating: 5,
    likes: 24,
    avatarBg: 'bg-amber-600',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'c2',
    movieId: 'ben-10-af-s3',
    userName: 'Nalaka Bandara',
    comment: 'Sinhala hoda quality ekata dubbed karala thiyenne. Direct links fast download wenawa server 1 eken.',
    rating: 5,
    likes: 18,
    avatarBg: 'bg-emerald-600',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'c3',
    movieId: 'kung-fu-panda-4-with-sinhala-subtitle',
    userName: 'Pathum Fernando',
    comment: 'Kung Fu Panda 4 Sinhala audio & subtitle quality eka godak lassanai! Movie quality eka 1080p high quality. Direct download eka ikmanata wuna. Bohoma sthuthi!',
    rating: 5,
    likes: 31,
    avatarBg: 'bg-indigo-600',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'c4',
    movieId: 'shrek-01-sinhala-dubbed',
    userName: 'Dilshan Silva',
    comment: 'Shrek 1 sinhala dubbed 1080p baluwa. Direct fast streaming and download server links elatama wada. Admin ta sthuthi!',
    rating: 5,
    likes: 42,
    avatarBg: 'bg-purple-600',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
  }
];

let reportsCache: any[] = [];

// Real Analytics Engine Cache
const activeSessionsMap = new Map<string, number>(); // sessionId -> timestamp
const visitorSessionsToday = new Set<string>(); // unique session IDs for today
let currentStatsDate = new Date().toISOString().split('T')[0];
let totalDownloadsToday = 0;

function checkDateReset() {
  const today = new Date().toISOString().split('T')[0];
  if (today !== currentStatsDate) {
    currentStatsDate = today;
    visitorSessionsToday.clear();
    totalDownloadsToday = 0;
  }
}

// MongoDB Client Connection (if MONGODB_URI is provided)
let dbClient: MongoClient | null = null;
async function connectToMongo() {
  const mongoUri = process.env.MONGODB_URI?.trim();
  if (!mongoUri || (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://'))) {
    return null;
  }
  try {
    if (!dbClient) {
      dbClient = new MongoClient(mongoUri);
      await dbClient.connect();
      console.log('Connected to MongoDB Atlas');
    }
    return dbClient.db('cineworld');
  } catch (err) {
    console.warn('MongoDB connection note:', err);
    return null;
  }
}

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
    } catch (e) {
      console.error('Mongo DB init error:', e);
    }
  }
}

initDb();

// ==================== API ROUTES ====================

// Real Analytics & Heartbeat API
app.post('/api/stats/heartbeat', (req, res) => {
  checkDateReset();
  const sessionId = (req.body && req.body.sessionId) || req.ip || 'session-default';
  const now = Date.now();
  activeSessionsMap.set(sessionId, now);
  visitorSessionsToday.add(sessionId);

  // Clean stale active sessions older than 90 seconds
  for (const [sId, ts] of activeSessionsMap.entries()) {
    if (now - ts > 90000) activeSessionsMap.delete(sId);
  }

  const onlineCount = Math.max(1, activeSessionsMap.size);
  const todayVisitors = Math.max(1, visitorSessionsToday.size);

  return res.json({
    success: true,
    onlineCount,
    todayVisitors,
    todayDownloads: totalDownloadsToday
  });
});

app.get('/api/stats', (req, res) => {
  checkDateReset();
  const now = Date.now();
  for (const [sId, ts] of activeSessionsMap.entries()) {
    if (now - ts > 90000) activeSessionsMap.delete(sId);
  }

  const removedIds = ['the-croods-a-new-age-2020', 'avatar-tla-s1'];
  const validMovies = moviesCache.filter((m: any) => !removedIds.includes(m.id));
  const topMovie = [...validMovies].sort((a: any, b: any) => (b.viewsCount || 0) - (a.viewsCount || 0))[0] || validMovies[0];

  return res.json({
    onlineCount: Math.max(1, activeSessionsMap.size),
    todayVisitors: Math.max(1, visitorSessionsToday.size),
    todayDownloads: totalDownloadsToday,
    totalMovies: validMovies.length,
    topMovie: topMovie ? {
      id: topMovie.id,
      title: topMovie.title,
      viewsCount: topMovie.viewsCount || 0,
      downloadsCount: topMovie.downloadsCount || 0,
      category: topMovie.category
    } : null
  });
});

app.post('/api/movies/:id/view', async (req, res) => {
  const { id } = req.params;
  let updatedMovie: any = null;
  moviesCache = moviesCache.map((m: any) => {
    if (m.id === id) {
      updatedMovie = { ...m, viewsCount: (m.viewsCount || 0) + 1 };
      return updatedMovie;
    }
    return m;
  });

  const db = await connectToMongo();
  if (db && updatedMovie) {
    await db.collection('movies').updateOne({ id }, { $inc: { viewsCount: 1 } });
  }
  return res.json({ success: true, viewsCount: updatedMovie?.viewsCount || 1 });
});

app.post('/api/movies/:id/download', async (req, res) => {
  checkDateReset();
  const { id } = req.params;
  totalDownloadsToday += 1;
  let updatedMovie: any = null;
  moviesCache = moviesCache.map((m: any) => {
    if (m.id === id) {
      updatedMovie = { ...m, downloadsCount: (m.downloadsCount || 0) + 1 };
      return updatedMovie;
    }
    return m;
  });

  const db = await connectToMongo();
  if (db && updatedMovie) {
    await db.collection('movies').updateOne({ id }, { $inc: { downloadsCount: 1 } });
  }
  return res.json({ success: true, downloadsCount: updatedMovie?.downloadsCount || 1, todayDownloads: totalDownloadsToday });
});

// GET /api/movies
app.get('/api/movies', async (req, res) => {
  const removedIds = ['the-croods-a-new-age-2020', 'avatar-tla-s1'];
  try {
    const db = await connectToMongo();
    if (db) {
      const dbMovies = await db.collection('movies').find({}).toArray();
      if (dbMovies && dbMovies.length > 0) {
        moviesCache = dbMovies.filter((m: any) => !removedIds.includes(m.id));
      }
    }
    const cleanMovies = moviesCache.filter((m: any) => !removedIds.includes(m.id));
    return res.json(cleanMovies);
  } catch (err: any) {
    const cleanMovies = moviesCache.filter((m: any) => !removedIds.includes(m.id));
    return res.json(cleanMovies);
  }
});

// Requests API
app.get('/api/requests', (req, res) => res.json(requestsCache));
app.post('/api/requests', rateLimitShield(5, 60000), async (req, res) => {
  const newReq = {
    ...req.body,
    movieTitle: sanitizeText(req.body.movieTitle),
    requestedBy: sanitizeText(req.body.requestedBy) || 'Anonymous',
    id: 'req-' + Date.now(),
    createdAt: new Date().toISOString()
  };
  requestsCache = [newReq, ...requestsCache];
  const db = await connectToMongo();
  if (db) await db.collection('requests').insertOne(newReq);
  return res.json({ success: true, request: newReq });
});

// Sinhala Cartoons API Proxy
app.get('/api/slcartoons/search', async (req, res) => {
  try {
    const text = (req.query.text as string) || 'ben 10';
    const apiKey = 'zan_FLUs8y9T_fcz7cgi12p';
    const response = await fetch(`https://api.zanta-mini.store/api/slcartoons/search?apiKey=${apiKey}&text=${encodeURIComponent(text)}`);
    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/slcartoons/dl', async (req, res) => {
  try {
    const text = req.query.text as string;
    if (!text) return res.status(400).json({ success: false, error: 'URL parameter text is required' });
    const apiKey = 'zan_FLUs8y9T_fcz7cgi12p';
    const response = await fetch(`https://api.zanta-mini.store/api/slcartoons/dl?apiKey=${apiKey}&text=${encodeURIComponent(text)}`);
    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Notices API
app.get('/api/notices', (req, res) => res.json(noticesCache));

// Broken Link Reports API
app.get('/api/reports', (req, res) => res.json(reportsCache));
app.post('/api/reports', rateLimitShield(5, 60000), async (req, res) => {
  try {
    const { movieId, movieTitle, issueType, description } = req.body;
    if (!movieId) return res.status(400).json({ error: 'movieId parameter is required' });

    const newReport = {
      id: 'rep-' + Date.now(),
      movieId: sanitizeText(movieId),
      movieTitle: sanitizeText(movieTitle) || 'Unknown Content',
      issueType: sanitizeText(issueType) || 'Stream Not Working',
      description: sanitizeText(description),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    reportsCache = [newReport, ...reportsCache];
    const db = await connectToMongo();
    if (db) await db.collection('reports').insertOne(newReport);

    return res.json({ success: true, report: newReport });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/reports/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    reportsCache = reportsCache.map((r) => (r.id === id ? { ...r, status: 'Resolved' } : r));
    const db = await connectToMongo();
    if (db) await db.collection('reports').updateOne({ id }, { $set: { status: 'Resolved' } });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    reportsCache = reportsCache.filter((r) => r.id !== id);
    const db = await connectToMongo();
    if (db) await db.collection('reports').deleteOne({ id });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Comments API
app.get('/api/comments', (req, res) => {
  const { movieId } = req.query;
  if (movieId) {
    const filtered = commentsCache.filter((c) => c.movieId === movieId);
    return res.json(filtered);
  }
  return res.json(commentsCache);
});

app.post('/api/comments', rateLimitShield(8, 60000), async (req, res) => {
  try {
    const { movieId, userName, comment, rating } = req.body;
    if (!movieId || !comment) {
      return res.status(400).json({ error: 'movieId and comment are required' });
    }

    const bgColors = ['bg-amber-600', 'bg-emerald-600', 'bg-blue-600', 'bg-purple-600', 'bg-rose-600'];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];

    const newComment = {
      id: 'comm-' + Date.now(),
      movieId: sanitizeText(movieId),
      userName: sanitizeText(userName) || 'Anonymous Fan',
      comment: sanitizeText(comment),
      rating: Number(rating) || 5,
      likes: 0,
      avatarBg: randomBg,
      createdAt: new Date().toISOString()
    };

    commentsCache = [newComment, ...commentsCache];

    const db = await connectToMongo();
    if (db) {
      await db.collection('comments').insertOne(newComment);
    }

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

    const db = await connectToMongo();
    if (db && foundComment) {
      await db.collection('comments').updateOne({ id }, { $inc: { likes: 1 } });
    }

    return res.json({ success: true, comment: foundComment });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
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




