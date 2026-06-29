import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import { initDb, pool } from './db.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);
const jwtSecret = process.env.JWT_SECRET || 'change-this-secret-before-deploy';
const clients = new Set();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: '1mb' }));

function signToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '12h' });
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'Missing login token.' });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ message: 'Your session has expired. Please login again.' });
  }
}

function notifyClients() {
  for (const res of clients) {
    res.write(`event: dashboard:update\ndata: ${JSON.stringify({ at: new Date().toISOString() })}\n\n`);
  }
}

function normalizeItem(body) {
  return {
    type: String(body.type || '').trim(),
    name: String(body.name || '').trim(),
    label: body.label ? String(body.label).trim() : null,
    description: body.description ? String(body.description).trim() : null,
    company: body.company ? String(body.company).trim() : null,
    platform: body.platform ? String(body.platform).trim() : null,
    url: body.url ? String(body.url).trim() : null,
    username: body.username ? String(body.username).trim() : null,
    password: body.password ? String(body.password) : null,
    notes: body.notes ? String(body.notes).trim() : null,
  };
}

function validateItem(item) {
  const allowedTypes = new Set(['software', 'website', 'social', 'vault']);
  if (!allowedTypes.has(item.type)) return 'Choose a valid item type.';
  if (!item.name) return 'Name is required.';
  if (item.type === 'vault' && (!item.username || !item.password)) return 'Vault records need a username and password.';
  if (item.type !== 'vault' && !item.url) return 'A website link is required.';
  return null;
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const username = String(req.body.username || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const result = await pool.query('SELECT id, username, password_hash FROM users WHERE LOWER(username) = $1', [username]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    return res.json({ token: signToken(user), user: { id: user.id, username: user.username } });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/items', authenticate, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM dashboard_items ORDER BY created_at ASC');
    res.json({ items: result.rows });
  } catch (error) {
    next(error);
  }
});

app.post('/api/items', authenticate, async (req, res, next) => {
  try {
    const item = normalizeItem(req.body);
    const error = validateItem(item);
    if (error) return res.status(400).json({ message: error });

    const id = crypto.randomUUID();
    const result = await pool.query(
      `INSERT INTO dashboard_items
       (id, type, name, label, description, company, platform, url, username, password, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [id, item.type, item.name, item.label, item.description, item.company, item.platform, item.url, item.username, item.password, item.notes],
    );
    notifyClients();
    return res.status(201).json({ item: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

app.put('/api/items/:id', authenticate, async (req, res, next) => {
  try {
    const item = normalizeItem(req.body);
    const error = validateItem(item);
    if (error) return res.status(400).json({ message: error });

    const result = await pool.query(
      `UPDATE dashboard_items
       SET type = $2, name = $3, label = $4, description = $5, company = $6, platform = $7,
           url = $8, username = $9, password = $10, notes = $11, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [req.params.id, item.type, item.name, item.label, item.description, item.company, item.platform, item.url, item.username, item.password, item.notes],
    );

    if (!result.rowCount) return res.status(404).json({ message: 'Record not found.' });
    notifyClients();
    return res.json({ item: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/items/:id', authenticate, async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM dashboard_items WHERE id = $1', [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ message: 'Record not found.' });
    notifyClients();
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

app.get('/api/events', authenticate, (req, res) => {
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
  });
  res.write('event: dashboard:ready\ndata: {}\n\n');
  clients.add(res);
  req.on('close', () => clients.delete(res));
});

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  return res.status(500).json({ message: 'Server error. Please try again.' });
});

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Dashboard API running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start dashboard API:', error);
    process.exit(1);
  });
