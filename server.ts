import express from 'express';
import path from 'path';
import { MongoClient } from 'mongodb';
import { createServer as createViteServer } from 'vite';
import { INITIAL_MOVIES, INITIAL_REVIEWS } from './src/data/initialMovies';

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://heshancamika_db_user:XM8EiSj9zHJLeMuG@cluster0.nimdgb1.mongodb.net/?appName=Cluster0';
const client = new MongoClient(mongoUri);
let db: any = null;

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
      }
    }
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize DB Connection
  await connectToMongo();

  // API Routes
  app.get('/api/health', async (req, res) => {
    try {
      const database = await connectToMongo();
      if (database) {
        const movieCount = await database.collection('movies').countDocuments();
        res.json({ status: 'ok', db: 'connected', movieCount });
      } else {
        res.json({ status: 'warning', db: 'disconnected' });
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
        // Remove MongoDB _id from response
        const formatted = movies.map(({ _id, ...rest }: any) => rest);
        return res.json(formatted);
      }
      return res.json(INITIAL_MOVIES);
    } catch (error: any) {
      console.error('Error fetching movies:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST Create Movie
  app.post('/api/movies', async (req, res) => {
    try {
      const database = await connectToMongo();
      const movieData = req.body;
      const newId = 'm-' + Date.now();
      const newMovie = {
        ...movieData,
        id: newId,
        viewsCount: movieData.viewsCount || 0,
        downloadsCount: movieData.downloadsCount || 0,
        createdAt: movieData.createdAt || new Date().toISOString()
      };

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
        return res.json(formatted);
      }
      return res.json([]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST Notice
  app.post('/api/notices', async (req, res) => {
    try {
      const database = await connectToMongo();
      const newNotice = {
        id: 'notice-' + Date.now(),
        title: req.body.title || 'Site Update',
        message: req.body.message || '',
        type: req.body.type || 'info',
        createdAt: new Date().toISOString(),
        active: true
      };
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
        return res.json(formatted);
      }
      return res.json([]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST Submit Request
  app.post('/api/requests', async (req, res) => {
    try {
      const database = await connectToMongo();
      const newReq = {
        id: 'req-' + Date.now(),
        ...req.body,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
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
        return res.json(grouped);
      }
      return res.json(INITIAL_REVIEWS);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST Add Review
  app.post('/api/reviews', async (req, res) => {
    try {
      const database = await connectToMongo();
      const newReview = {
        id: 'rev-' + Date.now(),
        ...req.body,
        date: new Date().toISOString().split('T')[0]
      };
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
