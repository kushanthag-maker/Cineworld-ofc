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
