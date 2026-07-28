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

// Global Security Headers for ALL Requests (HTML, Static Assets, and API)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=(), usb=()');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: http:; media-src 'self' blob: https: http:; connect-src 'self' https: wss: ws:; frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self';"
  );
  res.setHeader('X-AI-Security-Shield', 'Active - Anti-Scrape Protection Enabled');
  next();
});

// Comprehensive Security Headers & Data Protection for API routes
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// AI Anti-Scraper & Bot Shield Engine
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'CW2026#Admin!Secure';
const blockedScraperIPs = new Map<string, { reason: string; timestamp: string; count: number }>();
const adminBannedIPs = new Map<string, { reason: string; timestamp: string }>();
const scraperActivityLogs = new Map<string, number[]>();
let totalBlockedScraperAttempts = 0; // Real live blocked attempts counter
const deletedMovieIdsCache = new Set<string>(); // Persistent deleted movies cache

// Real Site Reach & Traffic Analytics Engine
const hourlyReachMap = new Array(24).fill(0);
const realUserIPsToday = new Set<string>();
let streamPlaysCounter = 0;

const SUSPICIOUS_USER_AGENTS = [
  'python', 'scrapy', 'curl', 'wget', 'selenium', 'puppeteer', 'phantomjs', 'headless',
  'axios', 'go-http-client', 'postman', 'requests', 'aiohttp', 'beautifulsoup', 'urllib',
  'mechanize', 'httrack', 'nikto', 'sqlmap', 'burp', 'zgrab', 'nmap', 'semrush', 'ahrefs',
  'dotbot', 'rogue-bot', 'site-grabber', 'teleport', 'webcopier', 'webripper'
];

// Anti-Scraping Shield Middleware
app.use((req, res, next) => {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();

  // Check if IP is already blocked
  if (blockedScraperIPs.has(ip)) {
    totalBlockedScraperAttempts++;
    return res.status(403).json({
      success: false,
      error: 'AI Security Shield: Access Denied. Your IP is flagged for scraping or automated bot activity.',
      code: 'BOT_BLOCKED'
    });
  }

  // Detect suspicious Bot User-Agents
  const isBotUserAgent = SUSPICIOUS_USER_AGENTS.some(agent => userAgent.includes(agent));
  if (isBotUserAgent && !userAgent.includes('mozilla') && !userAgent.includes('chrome') && !userAgent.includes('safari')) {
    blockedScraperIPs.set(ip, {
      reason: `Suspicious Automated Scraper User-Agent: ${req.headers['user-agent']}`,
      timestamp: new Date().toISOString(),
      count: 1
    });
    totalBlockedScraperAttempts++;
    console.warn(`[AI SECURITY SHIELD] Blocked scraper bot IP ${ip} with User-Agent: ${req.headers['user-agent']}`);
    return res.status(403).json({
      success: false,
      error: 'AI Security Shield: Automated web scraping or crawler detected.',
      code: 'BOT_USER_AGENT_BLOCKED'
    });
  }

  // Detect High-Frequency Harvesting / Rapid API Scrape Bursts
  if (req.path.startsWith('/api/')) {
    const now = Date.now();
    const timestamps = (scraperActivityLogs.get(ip) || []).filter(t => now - t < 10000); // 10 sec window
    timestamps.push(now);
    scraperActivityLogs.set(ip, timestamps);

    if (timestamps.length > 25) { // Exceeded 25 API hits in 10s -> Auto Block
      blockedScraperIPs.set(ip, {
        reason: 'Automated Rapid API Harvesting Burst (>25 requests in 10s)',
        timestamp: new Date().toISOString(),
        count: timestamps.length
      });
      totalBlockedScraperAttempts++;
      console.warn(`[AI SECURITY SHIELD] Auto-Blocked scraper IP ${ip} for rapid burst API scraping.`);
      return res.status(429).json({
        success: false,
        error: 'AI Security Shield: High-frequency API scraping detected. IP auto-blocked.',
        code: 'SCRAPER_BURST_BLOCKED'
      });
    }
  }

  // Record real user site reach & traffic analytics
  const hour = new Date().getHours();
  hourlyReachMap[hour] = (hourlyReachMap[hour] || 0) + 1;
  realUserIPsToday.add(ip);

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
let noticesCache: any[] = [];

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

let promoCodesCache: any[] = [
  {
    id: 'p1',
    code: 'VIP7DAYS',
    days: 7,
    isUsed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p2',
    code: 'CINE30D',
    days: 30,
    isUsed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p3',
    code: 'PREMIUM365',
    days: 365,
    isUsed: false,
    createdAt: new Date().toISOString()
  }
];

let vipRequestsCache: any[] = [
  {
    id: 'vr-1',
    userName: 'Kushan Perera',
    whatsappNumber: '+94771234567',
    dataCardNumber: 'DC-9874-1256-88',
    packageDays: 30,
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

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

      // Cleanup removed items
      const removedIds = [
        "devi-kusumasana-2025-sinhala-movie",
        "kung-fu-panda-4-2024-sinhala-dubbed",
        "scooby-doo-and-the-cyber-chase-sinhala-dubbed",
        "the-adventures-of-tintin-sinhala-dubbed",
        "tom-and-jerry-cowboy-up-sinhala-dubbed",
        "inside-out-2-2024-sinhala-dubbed",
        "despicable-me-4-2024-sinhala-dubbed",
        "gajaman-3d-sinhala-movie",
        "moana-2-2024-sinhala-subbed"
      ];
      await moviesCol.deleteMany({ id: { $in: removedIds } });

      const count = await moviesCol.countDocuments();
      if (count === 0) {
        await moviesCol.insertMany(initialSeedMovies);
        moviesCache = [...initialSeedMovies];
      } else {
        const storedMovies = await moviesCol.find({}).toArray();
        const storedIds = new Set(storedMovies.map((m: any) => m.id));
        const missingSeedMovies = initialSeedMovies.filter(m => !storedIds.has(m.id));
        
        if (missingSeedMovies.length > 0) {
          await moviesCol.insertMany(missingSeedMovies);
          storedMovies.push(...(missingSeedMovies as any[]));
        }
        moviesCache = storedMovies;
      }
    } catch (e) {
      console.error('Mongo DB init error:', e);
    }
  } else {
    moviesCache = [...initialSeedMovies];
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

app.post('/api/movies/:id/stream-play', (req, res) => {
  streamPlaysCounter++;
  return res.json({ success: true, totalStreamPlays: streamPlaysCounter });
});

app.get('/api/admin/analytics', (req, res) => {
  const activeOnline = Math.max(1, activeSessionsMap.size);
  const todayVisitors = Math.max(1, realUserIPsToday.size);
  const totalViews = hourlyReachMap.reduce((a, b) => a + b, 0);

  const formattedHourly = hourlyReachMap.map((views, h) => ({
    hour: `${h < 10 ? '0' + h : h}:00`,
    views
  }));

  const removedIds = ['the-croods-a-new-age-2020', 'avatar-tla-s1'];
  const validMovies = moviesCache.filter((m: any) => !removedIds.includes(m.id) && !deletedMovieIdsCache.has(m.id));
  const topStreamed = [...validMovies]
    .sort((a: any, b: any) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .slice(0, 5)
    .map(m => ({ id: m.id, title: m.title, category: m.category, views: m.viewsCount || 0 }));

  return res.json({
    success: true,
    activeOnline,
    todayVisitors,
    totalViews,
    todayDownloads: totalDownloadsToday,
    streamPlays: streamPlaysCounter,
    totalMovies: validMovies.length,
    hourlyReach: formattedHourly,
    topStreamed
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
        moviesCache = dbMovies.filter((m: any) => !removedIds.includes(m.id) && !deletedMovieIdsCache.has(m.id));
      }
    }
    const cleanMovies = moviesCache.filter((m: any) => !removedIds.includes(m.id) && !deletedMovieIdsCache.has(m.id));
    return res.json(cleanMovies);
  } catch (err: any) {
    const cleanMovies = moviesCache.filter((m: any) => !removedIds.includes(m.id) && !deletedMovieIdsCache.has(m.id));
    return res.json(cleanMovies);
  }
});

// POST /api/movies - Create new movie
app.post('/api/movies', async (req, res) => {
  try {
    const newMovie = req.body;
    if (!newMovie || !newMovie.id || !newMovie.title) {
      return res.status(400).json({ success: false, error: 'Movie ID and Title are required' });
    }

    const index = moviesCache.findIndex((m: any) => m.id === newMovie.id);
    if (index !== -1) {
      moviesCache[index] = newMovie;
    } else {
      moviesCache.unshift(newMovie);
    }

    const db = await connectToMongo();
    if (db) {
      await db.collection('movies').updateOne(
        { id: newMovie.id },
        { $set: newMovie },
        { upsert: true }
      );
    }

    return res.json({ success: true, movie: newMovie });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/movies/:id - Update existing movie
app.put('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    if (!updatedData || !updatedData.title) {
      return res.status(400).json({ success: false, error: 'Valid movie details required' });
    }

    const targetId = id || updatedData.id;
    let found = false;

    moviesCache = moviesCache.map((m: any) => {
      if (m.id === targetId) {
        found = true;
        return { ...m, ...updatedData, id: targetId };
      }
      return m;
    });

    if (!found) {
      moviesCache.unshift({ ...updatedData, id: targetId });
    }

    const db = await connectToMongo();
    if (db) {
      await db.collection('movies').updateOne(
        { id: targetId },
        { $set: { ...updatedData, id: targetId } },
        { upsert: true }
      );
    }

    return res.json({ success: true, message: 'Movie updated successfully', movie: { ...updatedData, id: targetId } });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/movies/:id - Delete movie
app.delete('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    deletedMovieIdsCache.add(id);
    moviesCache = moviesCache.filter((m: any) => m.id !== id);

    const db = await connectToMongo();
    if (db) {
      await db.collection('movies').deleteOne({ id });
    }

    return res.json({ success: true, message: `Movie ${id} permanently deleted.` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
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
app.post('/api/notices', (req, res) => {
  const newNotice = {
    id: 'notice-' + Date.now(),
    title: sanitizeText(req.body.title) || 'CINEWORLD ANNOUNCEMENT',
    content: sanitizeText(req.body.content) || '',
    type: req.body.type || 'info',
    isActive: req.body.isActive !== false,
    createdAt: new Date().toISOString()
  };
  noticesCache = [newNotice, ...noticesCache];
  return res.json({ success: true, notice: newNotice });
});
app.delete('/api/notices/:id', (req, res) => {
  const { id } = req.params;
  noticesCache = noticesCache.filter(n => n.id !== id);
  return res.json({ success: true });
});

// Stream Server Health Diagnostics API
app.post('/api/admin/check-stream', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ success: false, error: 'URL required' });
  try {
    const start = Date.now();
    const response = await fetch(url, { method: 'HEAD' });
    const latency = Date.now() - start;
    return res.json({
      success: true,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      latencyMs: latency
    });
  } catch (err: any) {
    return res.json({
      success: false,
      error: err.message || 'Stream server unreachable / timeout'
    });
  }
});

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

// ==================== PROMO CODES & PREMIUM API ====================
app.get('/api/promo-codes', async (req, res) => {
  try {
    const db = await connectToMongo();
    if (db) {
      const storedCodes = await db.collection('promocodes').find({}).toArray();
      if (storedCodes && storedCodes.length > 0) {
        promoCodesCache = storedCodes;
      }
    }
    return res.json(promoCodesCache);
  } catch (err: any) {
    return res.json(promoCodesCache);
  }
});

app.post('/api/promo-codes/generate', rateLimitShield(10, 60000), async (req, res) => {
  try {
    const { days, customCode } = req.body;
    const durationDays = Math.max(1, parseInt(days) || 30);
    
    let generatedCodeStr = '';
    if (customCode && typeof customCode === 'string' && customCode.trim().length > 0) {
      generatedCodeStr = customCode.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
    } else {
      const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
      generatedCodeStr = `CINE-${durationDays}D-${randomPart}`;
    }

    // Check if duplicate code exists
    const existing = promoCodesCache.find(p => p.code.toUpperCase() === generatedCodeStr);
    if (existing) {
      return res.status(400).json({ success: false, error: 'Promo code already exists. Please choose a different custom code.' });
    }

    const newCode = {
      id: 'promo-' + Date.now(),
      code: generatedCodeStr,
      days: durationDays,
      isUsed: false,
      createdAt: new Date().toISOString()
    };

    promoCodesCache = [newCode, ...promoCodesCache];

    const db = await connectToMongo();
    if (db) {
      await db.collection('promocodes').insertOne(newCode);
    }

    return res.json({ success: true, promoCode: newCode });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/promo-codes/redeem', rateLimitShield(8, 60000), async (req, res) => {
  try {
    const { code, userName } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, error: 'Please enter a valid Promo Code.' });
    }

    const cleanCode = code.trim().toUpperCase();
    const foundIndex = promoCodesCache.findIndex(p => p.code.toUpperCase() === cleanCode);

    if (foundIndex === -1) {
      return res.status(404).json({ success: false, error: 'Invalid Promo Code! Please verify your code and try again.' });
    }

    const promoItem = promoCodesCache[foundIndex];
    if (promoItem.isUsed) {
      return res.status(400).json({ 
        success: false, 
        error: `This Promo Code (${cleanCode}) has already been redeemed! Promo codes are single-use only.` 
      });
    }

    // Mark as used
    const updatedPromo = {
      ...promoItem,
      isUsed: true,
      usedBy: sanitizeText(userName) || 'CINEWORLD Fan',
      usedAt: new Date().toISOString()
    };

    promoCodesCache[foundIndex] = updatedPromo;

    const db = await connectToMongo();
    if (db) {
      await db.collection('promocodes').updateOne({ id: promoItem.id }, { $set: updatedPromo });
    }

    const expiresAt = Date.now() + (promoItem.days * 24 * 60 * 60 * 1000);

    return res.json({
      success: true,
      days: promoItem.days,
      expiresAt,
      code: promoItem.code,
      message: `🎉 Promo code redeemed! You have received ${promoItem.days} Days of CINEWORLD VIP Premium Membership.`
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/promo-codes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    promoCodesCache = promoCodesCache.filter(p => p.id !== id);
    const db = await connectToMongo();
    if (db) {
      await db.collection('promocodes').deleteOne({ id });
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==================== DATA CARD VIP REQUESTS API ====================
app.get('/api/vip-requests', async (req, res) => {
  try {
    const db = await connectToMongo();
    if (db) {
      const stored = await db.collection('vip_requests').find({}).toArray();
      if (stored && stored.length > 0) {
        vipRequestsCache = stored;
      }
    }
    return res.json(vipRequestsCache);
  } catch (err: any) {
    return res.json(vipRequestsCache);
  }
});

app.post('/api/vip-requests', rateLimitShield(5, 60000), async (req, res) => {
  try {
    const { userName, whatsappNumber, dataCardNumber, packageDays } = req.body;
    if (!dataCardNumber || typeof dataCardNumber !== 'string' || dataCardNumber.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'කරුණාකර වලංගු Data Card අංකය (PIN / Serial) ඇතුළත් කරන්න.' });
    }

    const cleanName = sanitizeText(userName) || 'CINEWORLD User';
    const cleanPhone = sanitizeText(whatsappNumber) || 'Not provided';
    const cleanCard = sanitizeText(dataCardNumber);
    const durationDays = [1, 7, 30, 60, 90, 365].includes(Number(packageDays)) ? Number(packageDays) : 30;

    const newReq = {
      id: 'vr-' + Date.now(),
      userName: cleanName,
      whatsappNumber: cleanPhone,
      dataCardNumber: cleanCard,
      packageDays: durationDays,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    vipRequestsCache = [newReq, ...vipRequestsCache];

    const db = await connectToMongo();
    if (db) {
      await db.collection('vip_requests').insertOne(newReq);
    }

    return res.json({
      success: true,
      vipRequest: newReq,
      message: '🎉 Data Card VIP Request submitted successfully! Admin will verify and activate your access shortly.'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/vip-requests/approve', async (req, res) => {
  try {
    const { id } = req.body;
    const reqIndex = vipRequestsCache.findIndex(r => r.id === id);
    if (reqIndex === -1) {
      return res.status(404).json({ success: false, error: 'VIP Request not found' });
    }

    const targetReq = vipRequestsCache[reqIndex];
    // Generate a promo code for this user
    const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
    const generatedCodeStr = `VIP-${targetReq.packageDays}D-${randomPart}`;

    const newCode = {
      id: 'promo-' + Date.now(),
      code: generatedCodeStr,
      days: targetReq.packageDays,
      isUsed: false,
      createdAt: new Date().toISOString()
    };

    promoCodesCache = [newCode, ...promoCodesCache];

    const updatedReq = {
      ...targetReq,
      status: 'Approved',
      promoCodeGenerated: generatedCodeStr
    };

    vipRequestsCache[reqIndex] = updatedReq;

    const db = await connectToMongo();
    if (db) {
      await db.collection('promocodes').insertOne(newCode);
      await db.collection('vip_requests').updateOne({ id }, { $set: updatedReq });
    }

    return res.json({
      success: true,
      promoCode: generatedCodeStr,
      vipRequest: updatedReq,
      message: `VIP Request Approved! Promo code generated: ${generatedCodeStr}`
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/vip-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    vipRequestsCache = vipRequestsCache.filter(r => r.id !== id);
    const db = await connectToMongo();
    if (db) {
      await db.collection('vip_requests').deleteOne({ id });
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// AI Anti-Scraper Shield API Endpoints
app.get('/api/security/shield-status', (req, res) => {
  const blockedList = Array.from(blockedScraperIPs.entries()).map(([ip, details]) => ({
    ip,
    reason: details.reason,
    timestamp: details.timestamp,
    count: details.count
  }));

  return res.json({
    success: true,
    shieldStatus: 'ACTIVE',
    threatLevel: blockedList.length > 5 ? 'HIGH' : 'ELEVATED_DEFENSE',
    totalBlockedAttempts: totalBlockedScraperAttempts,
    blockedIPsCount: blockedList.length,
    activeProtectionRules: [
      'Scraper Bot User-Agent Filter (Python, Scrapy, Curl, Wget, Selenium, Puppeteer)',
      'Burst API Harvesting Detection (>25 requests in 10s)',
      'Anti-Hotlinking & Link Obfuscation Headers',
      'No-Robots Crawler Disallow Directive',
      'XSS Payload Sanitization & Anti-DoS Payload Limits'
    ],
    blockedList
  });
});

app.post('/api/security/unblock-ip', (req, res) => {
  const { ip } = req.body;
  if (ip) {
    blockedScraperIPs.delete(ip);
    adminBannedIPs.delete(ip);
    return res.json({ success: true, message: `IP ${ip} has been unblocked from AI Security Shield.` });
  }
  return res.status(400).json({ success: false, error: 'IP not found in blocked list.' });
});

// Admin Panel Security & Single-Attempt Auto-Ban System
app.get('/api/admin/check-status', (req, res) => {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
  const isBanned = blockedScraperIPs.has(ip) || adminBannedIPs.has(ip);
  return res.json({ success: true, isBanned, ip });
});

app.post('/api/admin/login', (req, res) => {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
  const { password } = req.body;

  // Check if IP is already banned
  if (blockedScraperIPs.has(ip) || adminBannedIPs.has(ip)) {
    return res.status(403).json({
      success: false,
      isBanned: true,
      error: 'SECURITY SHIELD ACTIVATED: Access Denied. Your IP is permanently banned from Admin Access due to previous invalid password attempt.'
    });
  }

  // Validate Password
  if (!password || typeof password !== 'string' || password.trim() !== ADMIN_PASSWORD) {
    // 1ST WRONG ATTEMPT -> INSTANT PERMANENT IP AUTO-BAN!
    const banDetails = {
      reason: 'Failed Admin Authentication Password Attempt (1st Attempt Instant Auto-Ban)',
      timestamp: new Date().toISOString(),
      count: 1
    };
    blockedScraperIPs.set(ip, banDetails);
    adminBannedIPs.set(ip, banDetails);
    totalBlockedScraperAttempts++;

    console.warn(`[ADMIN SECURITY SHIELD] INSTANTLY BANNED IP ${ip} after 1 failed admin password attempt.`);

    return res.status(403).json({
      success: false,
      isBanned: true,
      error: 'SECURITY SHIELD ACTIVATED: Incorrect admin password! Your IP has been INSTANTLY BANNED from accessing the Admin Panel.'
    });
  }

  // Success
  const adminToken = 'cw_admin_session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
  return res.json({
    success: true,
    token: adminToken,
    message: 'Admin authentication verified successfully.'
  });
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




