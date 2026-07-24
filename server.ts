import express from 'express';
import path from 'path';
import { MongoClient } from 'mongodb';
import { createServer as createViteServer } from 'vite';
import { INITIAL_MOVIES, INITIAL_REVIEWS } from './src/data/initialMovies';

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://heshancamika_db_user:XM8EiSj9zHJLeMuG@cluster0.nimdgb1.mongodb.net/?appName=Cluster0';
const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 5000 });
let db: any = null;

// In-Memory Fallback Caches
let moviesCache: any[] = [...INITIAL_MOVIES];
let requestsCache: any[] = [];
let noticesCache: any[] = [];
let reviewsCache: Record<string, any[]> = { ...INITIAL_REVIEWS };

async function connectToMongo() {
  try {
    if (!db) {
      await client.connect();
      db = client.db('cineworld_db');
      console.log('Successfully connected to MongoDB Atlas (cineworld_db)');

      // Seed initial movies if collection is empty
      const moviesCollection = db.collection('movies');
      const count = await moviesCollection.countDocuments();
      if (count === 0) {
        console.log('Seeding initial movies into MongoDB...');
        await moviesCollection.insertMany(INITIAL_MOVIES);
      } else {
        const docs = await moviesCollection.find({}).sort({ createdAt: -1 }).toArray();
        moviesCache = docs.map(({ _id, ...rest }: any) => rest);
      }

      // Seed initial reviews if empty
      const reviewsCollection = db.collection('reviews');
      const reviewsCount = await reviewsCollection.countDocuments();
      if (reviewsCount === 0) {
        console.log('Seeding initial reviews into MongoDB...');
        const initialReviewList: any[] = [];
        Object.entries(INITIAL_REVIEWS).forEach(([movieId, revs]) => {
          revs.forEach((r) => initialReviewList.push({ ...r, movieId }));
        });
        if (initialReviewList.length > 0) {
          await reviewsCollection.insertMany(initialReviewList);
        }
      } else {
        const reviewList = await reviewsCollection.find({}).toArray();
        const grouped: Record<string, any[]> = {};
        reviewList.forEach(({ _id, ...r }: any) => {
          if (!grouped[r.movieId]) grouped[r.movieId] = [];
          grouped[r.movieId].push(r);
        });
        reviewsCache = grouped;
      }

      // Sync Requests
      const requestsCollection = db.collection('requests');
      const reqDocs = await requestsCollection.find({}).sort({ createdAt: -1 }).toArray();
      requestsCache = reqDocs.map(({ _id, ...rest }: any) => rest);

      // Sync Notices
      const noticesCollection = db.collection('notices');
      const noticeDocs = await noticesCollection.find({}).sort({ createdAt: -1 }).toArray();
      noticesCache = noticeDocs.map(({ _id, ...rest }: any) => rest);
    }
    return db;
  } catch (error) {
    console.warn('MongoDB connection unavailable or delayed. Using resilient in-memory store:', error);
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize DB Connection asynchronously in background
  connectToMongo().catch((err) => console.error('Background DB Connect:', err));

  // API Routes
  app.get('/api/health', async (req, res) => {
    try {
      const database = await connectToMongo();
      if (database) {
        const movieCount = await database.collection('movies').countDocuments();
        res.json({ status: 'ok', db: 'connected', movieCount });
      } else {
        res.json({ status: 'warning', db: 'disconnected', movieCount: moviesCache.length });
      }
    } catch (e: any) {
      res.status(500).json({ status: 'error', message: e.message });
    }
  });

  // GET Movies
  app.get('/api/movies', async (req, res) => {
    try {
      const database = await connectToMongo();
      if (database) {
        const movies = await database.collection('movies').find({}).sort({ createdAt: -1 }).toArray();
        const formatted = movies.map(({ _id, ...rest }: any) => rest);
        moviesCache = formatted;
        return res.json(formatted);
      }
      return res.json(moviesCache);
    } catch (error: any) {
      return res.json(moviesCache);
    }
  });

  // ==================== SINHALA CARTOON API INTEGRATION ====================
  const ZANTA_API_KEY = 'zan_FLUs8y9T_fcz7cgi12p';

  // Helper to import a cartoon item into CINEWORLD database
  async function importCartoonToDb(searchItem: any, dlDetails: any) {
    const rawUrl = searchItem.url || searchItem.link || '';
    if (!rawUrl) return null;

    const movieId = 'zanta-' + Buffer.from(rawUrl).toString('hex').slice(-24);

    const episodes = dlDetails?.episodes || [];
    const downloadLinks = dlDetails?.download_links || [];

    const streamUrl = episodes[0]?.stream_url || downloadLinks[0]?.final_link || searchItem.thumbnail || '';

    // Create Download Options for each episode or full series
    let downloadOptions: any[] = [];

    if (episodes.length > 0) {
      downloadOptions = episodes.map((ep: any, idx: number) => {
        const epNum = ep.episode || String(idx + 1).padStart(2, '0');
        const s1Url = ep.stream_url;
        const s2Url = downloadLinks[0]?.final_link || s1Url;

        return {
          id: `opt-ep-${idx + 1}`,
          quality: `Episode ${epNum}`,
          resolution: '1080p HD',
          size: '150 - 300 MB',
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
      .trim();

    const movieObj = {
      id: movieId,
      title: cleanTitle,
      originalTitle: searchItem.title,
      releaseYear: 2024,
      duration: dlDetails?.total_episodes ? `${dlDetails.total_episodes} Episodes` : 'Complete Series',
      rating: parseFloat(searchItem.rating) || 8.5,
      genres: ['Animation', 'Sinhala Cartoon', 'Action', 'Family'],
      director: 'Sinhala Cartoons LK',
      cast: ['Sinhala Dubbing Team'],
      description: `${cleanTitle} - Sinhala Dubbed Series available for online streaming and direct high-speed download. Total Episodes: ${dlDetails?.total_episodes || episodes.length || 1}.`,
      posterUrl: searchItem.thumbnail,
      backdropUrl: searchItem.thumbnail,
      streamUrl: streamUrl,
      category: 'Sinhala Dubbed',
      language: 'Sinhala Dubbed (සිංහල)',
      hasSinhalaSub: false,
      quality: searchItem.quality || '1080p HD',
      viewsCount: Math.floor(Math.random() * 800) + 300,
      downloadsCount: Math.floor(Math.random() * 500) + 200,
      downloadOptions: downloadOptions,
      createdAt: new Date().toISOString()
    };

    // Update in-memory cache
    moviesCache = [movieObj, ...moviesCache.filter((m) => m.id !== movieId)];

    // Persist to MongoDB Atlas
    const database = await connectToMongo();
    if (database) {
      await database.collection('movies').replaceOne({ id: movieId }, movieObj, { upsert: true });
    }

    return movieObj;
  }

  // GET /api/cartoons/search
  app.get('/api/cartoons/search', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const query = (req.query.text as string) || 'ben 10';
      const apiUrl = `https://api.zanta-mini.store/api/slcartoons/search?apiKey=${ZANTA_API_KEY}&text=${encodeURIComponent(query)}`;
      const response = await fetch(apiUrl);
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        return res.json(data);
      } catch (jsonErr) {
        return res.status(502).json({ success: false, message: 'External API returned non-JSON response.', raw: text.slice(0, 100) });
      }
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // GET /api/cartoons/dl
  app.get('/api/cartoons/dl', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const url = req.query.url as string;
      if (!url) return res.status(400).json({ error: 'URL parameter is required' });

      const apiUrl = `https://api.zanta-mini.store/api/slcartoons/dl?apiKey=${ZANTA_API_KEY}&text=${encodeURIComponent(url)}`;
      const response = await fetch(apiUrl);
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        return res.json(data);
      } catch (jsonErr) {
        return res.status(502).json({ success: false, message: 'External API returned non-JSON response.' });
      }
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST /api/cartoons/import
  app.post('/api/cartoons/import', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
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
          console.warn('Could not fetch dl details for item:', item.title);
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
    res.setHeader('Content-Type', 'application/json');
    try {
      const keywords = (req.body.keywords as string[]) || ['ben 10', 'tom and jerry', 'scooby', 'avatar', 'cartoon', 'sinhala'];
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
                console.warn(`Failed to import item ${item.title}:`, e);
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

  // Background Auto-Sync Worker (Runs every 10 minutes)
  setInterval(() => {
    console.log('[Auto-Sync] Running background Sinhala Cartoon sync worker...');
    const defaultKw = ['ben 10', 'tom and jerry', 'scooby', 'avatar', 'cartoon'];
    const kw = defaultKw[Math.floor(Math.random() * defaultKw.length)];

    fetch(`https://api.zanta-mini.store/api/slcartoons/search?apiKey=${ZANTA_API_KEY}&text=${encodeURIComponent(kw)}`)
      .then((r) => r.json())
      .then(async (data) => {
        if (data.success && Array.isArray(data.results)) {
          for (const item of data.results.slice(0, 3)) {
            const dlRes = await fetch(`https://api.zanta-mini.store/api/slcartoons/dl?apiKey=${ZANTA_API_KEY}&text=${encodeURIComponent(item.url)}`);
            const dlJson = await dlRes.json();
            if (dlJson.success) {
              await importCartoonToDb(item, dlJson.results);
            }
          }
          console.log(`[Auto-Sync] Successfully synced background cartoons for query "${kw}"`);
        }
      })
      .catch((e) => console.error('[Auto-Sync Error]:', e));
  }, 10 * 60 * 1000);

  // POST Create Movie
  app.post('/api/movies', async (req, res) => {
    try {
      const movieData = req.body;
      const newId = movieData.id || 'm-' + Date.now();
      const newMovie = {
        ...movieData,
        id: newId,
        viewsCount: movieData.viewsCount || 0,
        downloadsCount: movieData.downloadsCount || 0,
        createdAt: movieData.createdAt || new Date().toISOString()
      };

      moviesCache = [newMovie, ...moviesCache.filter((m) => m.id !== newId)];

      const database = await connectToMongo();
      if (database) {
        await database.collection('movies').insertOne(newMovie);
      }
      res.json({ success: true, movie: newMovie });
    } catch (error: any) {
      console.error('Error adding movie:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // PUT Update Movie
  app.put('/api/movies/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      moviesCache = moviesCache.map((m) => (m.id === id ? { ...m, ...updates } : m));

      const database = await connectToMongo();
      if (database) {
        await database.collection('movies').updateOne({ id }, { $set: updates });
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error updating movie:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE Movie
  app.delete('/api/movies/:id', async (req, res) => {
    try {
      const { id } = req.params;

      // Update in-memory cache immediately
      moviesCache = moviesCache.filter((m) => m.id !== id);

      const database = await connectToMongo();
      if (database) {
        const result = await database.collection('movies').deleteOne({ id });
        console.log(`Deleted movie ${id} from MongoDB, deletedCount: ${result.deletedCount}`);
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting movie:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET Notices
  app.get('/api/notices', async (req, res) => {
    try {
      const database = await connectToMongo();
      if (database) {
        const notices = await database.collection('notices').find({}).sort({ createdAt: -1 }).toArray();
        const formatted = notices.map(({ _id, ...rest }: any) => rest);
        noticesCache = formatted;
        return res.json(formatted);
      }
      return res.json(noticesCache);
    } catch (error: any) {
      return res.json(noticesCache);
    }
  });

  // POST Notice
  app.post('/api/notices', async (req, res) => {
    try {
      const newNotice = {
        id: req.body.id || 'notice-' + Date.now(),
        title: req.body.title || 'Site Update',
        message: req.body.message || '',
        type: req.body.type || 'info',
        createdAt: req.body.createdAt || new Date().toISOString(),
        active: true
      };

      noticesCache = [newNotice, ...noticesCache.filter((n) => n.id !== newNotice.id)];

      const database = await connectToMongo();
      if (database) {
        await database.collection('notices').insertOne(newNotice);
      }
      res.json({ success: true, notice: newNotice });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE Notice
  app.delete('/api/notices/:id', async (req, res) => {
    try {
      const { id } = req.params;
      noticesCache = noticesCache.filter((n) => n.id !== id);

      const database = await connectToMongo();
      if (database) {
        await database.collection('notices').deleteOne({ id });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Increment Views
  app.post('/api/movies/:id/view', async (req, res) => {
    try {
      const { id } = req.params;
      moviesCache = moviesCache.map((m) =>
        m.id === id ? { ...m, viewsCount: (m.viewsCount || 0) + 1 } : m
      );

      const database = await connectToMongo();
      if (database) {
        await database.collection('movies').updateOne({ id }, { $inc: { viewsCount: 1 } });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Increment Downloads
  app.post('/api/movies/:id/download', async (req, res) => {
    try {
      const { id } = req.params;
      moviesCache = moviesCache.map((m) =>
        m.id === id ? { ...m, downloadsCount: (m.downloadsCount || 0) + 1 } : m
      );

      const database = await connectToMongo();
      if (database) {
        await database.collection('movies').updateOne({ id }, { $inc: { downloadsCount: 1 } });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET Movie Requests
  app.get('/api/requests', async (req, res) => {
    try {
      const database = await connectToMongo();
      if (database) {
        const requests = await database.collection('requests').find({}).sort({ createdAt: -1 }).toArray();
        const formatted = requests.map(({ _id, ...rest }: any) => rest);
        requestsCache = formatted;
        return res.json(formatted);
      }
      return res.json(requestsCache);
    } catch (error: any) {
      return res.json(requestsCache);
    }
  });

  // POST Submit Request
  app.post('/api/requests', async (req, res) => {
    try {
      const newReq = {
        id: 'req-' + Date.now(),
        ...req.body,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };

      requestsCache = [newReq, ...requestsCache];

      const database = await connectToMongo();
      if (database) {
        await database.collection('requests').insertOne(newReq);
      }
      res.json({ success: true, request: newReq });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // PUT Update Request Status
  app.put('/api/requests/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      requestsCache = requestsCache.map((r) => (r.id === id ? { ...r, status } : r));

      const database = await connectToMongo();
      if (database) {
        await database.collection('requests').updateOne({ id }, { $set: { status } });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET Reviews
  app.get('/api/reviews', async (req, res) => {
    try {
      const database = await connectToMongo();
      if (database) {
        const reviewList = await database.collection('reviews').find({}).toArray();
        const grouped: Record<string, any[]> = {};
        reviewList.forEach(({ _id, ...r }: any) => {
          if (!grouped[r.movieId]) grouped[r.movieId] = [];
          grouped[r.movieId].push(r);
        });
        reviewsCache = grouped;
        return res.json(grouped);
      }
      return res.json(reviewsCache);
    } catch (error: any) {
      return res.json(reviewsCache);
    }
  });

  // POST Add Review
  app.post('/api/reviews', async (req, res) => {
    try {
      const newReview = {
        id: 'rev-' + Date.now(),
        ...req.body,
        date: new Date().toISOString().split('T')[0]
      };

      const mId = newReview.movieId;
      reviewsCache[mId] = [newReview, ...(reviewsCache[mId] || [])];

      const database = await connectToMongo();
      if (database) {
        await database.collection('reviews').insertOne(newReview);
      }
      res.json({ success: true, review: newReview });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite Middleware in Dev
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
