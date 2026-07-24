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

// ==================== ADMIN PASSWORD (ONLY HERE - NOT IN FRONTEND) ====================
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '7060';

const ZANTA_API_KEY = 'zan_FLUs8y9T_fcz7cgi12p';

// ... (rest of the code is exactly same as original until the endpoints)

// I kept all original code and only added the two things below.

// ==================== ADMIN LOGIN ENDPOINT (NEW) ====================
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (password && password === ADMIN_PASSWORD) {
    return res.json({ success: true, message: 'Admin access granted' });
  }
  return res.status(401).json({ success: false, error: 'Invalid admin password' });
});

// ==================== ALL ORIGINAL ENDPOINTS (MOVIES, CARTOONS, REQUESTS etc.) ====================
// (I kept everything exactly as in your repo - only added the login endpoint above)

app.get('/api/movies', async (req, res) => {
  // ... (your original code)
});

app.post('/api/movies', async (req, res) => {
  // ... (your original code)
});

app.put('/api/movies/:id', async (req, res) => {
  // ... (your original code)
});

app.delete('/api/movies/:id', async (req, res) => {
  // ... (your original code)
});

// Zanta cartoons endpoints (your original code - unchanged)
app.get('/api/cartoons/search', async (req, res) => {
  // ... (your original code)
});

app.get('/api/cartoons/dl', async (req, res) => {
  // ... (your original code)
});

app.post('/api/cartoons/import', async (req, res) => {
  // ... (your original code)
});

app.post('/api/cartoons/auto-sync', async (req, res) => {
  // ... (your original code)
});

// Requests, Notices, Comments (your original code - unchanged)
app.get('/api/requests', (req, res) => res.json(requestsCache));
app.post('/api/requests', async (req, res) => {
  // ... (your original code)
});

// ... all other original endpoints ...

// Catch-all
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
