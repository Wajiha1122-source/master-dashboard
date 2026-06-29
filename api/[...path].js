import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initDb, pool } from '../server/db.js';

const jwtSecret = process.env.JWT_SECRET || 'change-this-secret-before-deploy';
const ready = initDb();

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

function authenticate(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : req.query.token;
  if (!token) throw Object.assign(new Error('Missing login token.'), { status: 401 });
  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    throw Object.assign(new Error('Your session has expired. Please login again.'), { status: 401 });
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

export default async function handler(req, res) {
  try {
    await ready;

    if (req.method === 'OPTIONS') return send(res, 204, {});

    const path = Array.isArray(req.query.path) ? req.query.path.join('/') : String(req.query.path || '');

    if (path === 'health' && req.method === 'GET') return send(res, 200, { ok: true });

    if (path === 'events' && req.method === 'GET') {
      authenticate(req);
      return send(res, 200, { ok: true });
    }

    if (path === 'auth/login' && req.method === 'POST') {
      const body = parseBody(req);
      const username = String(body.username || '').trim().toLowerCase();
      const password = String(body.password || '');
      const result = await pool.query('SELECT id, username, password_hash FROM users WHERE LOWER(username) = $1', [username]);
      const user = result.rows[0];
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return send(res, 401, { message: 'Invalid username or password.' });
      }
      const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '12h' });
      return send(res, 200, { token, user: { id: user.id, username: user.username } });
    }

    if (path === 'items' && req.method === 'GET') {
      authenticate(req);
      const result = await pool.query('SELECT * FROM dashboard_items ORDER BY created_at ASC');
      return send(res, 200, { items: result.rows });
    }

    if (path === 'items' && req.method === 'POST') {
      authenticate(req);
      const item = normalizeItem(parseBody(req));
      const error = validateItem(item);
      if (error) return send(res, 400, { message: error });
      const id = crypto.randomUUID();
      const result = await pool.query(
        `INSERT INTO dashboard_items
         (id, type, name, label, description, company, platform, url, username, password, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [id, item.type, item.name, item.label, item.description, item.company, item.platform, item.url, item.username, item.password, item.notes],
      );
      return send(res, 201, { item: result.rows[0] });
    }

    const itemMatch = path.match(/^items\/(.+)$/);
    if (itemMatch && req.method === 'PUT') {
      authenticate(req);
      const item = normalizeItem(parseBody(req));
      const error = validateItem(item);
      if (error) return send(res, 400, { message: error });
      const result = await pool.query(
        `UPDATE dashboard_items
         SET type = $2, name = $3, label = $4, description = $5, company = $6, platform = $7,
             url = $8, username = $9, password = $10, notes = $11, updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [itemMatch[1], item.type, item.name, item.label, item.description, item.company, item.platform, item.url, item.username, item.password, item.notes],
      );
      if (!result.rowCount) return send(res, 404, { message: 'Record not found.' });
      return send(res, 200, { item: result.rows[0] });
    }

    if (itemMatch && req.method === 'DELETE') {
      authenticate(req);
      const result = await pool.query('DELETE FROM dashboard_items WHERE id = $1', [itemMatch[1]]);
      if (!result.rowCount) return send(res, 404, { message: 'Record not found.' });
      res.statusCode = 204;
      return res.end();
    }

    return send(res, 404, { message: 'API route not found.' });
  } catch (error) {
    return send(res, error.status || 500, { message: error.message || 'Server error. Please try again.' });
  }
}
