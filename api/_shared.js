import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initDb, pool } from '../server/db.js';

export const ready = initDb();
export const jwtSecret = process.env.JWT_SECRET || 'change-this-secret-before-deploy';
export { pool };

export function send(res, status, body) {
  res.statusCode = status;
  if (status === 204) return res.end();
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(body));
}

export function parseBody(req) {
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

export function authenticate(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : req.query.token;
  if (!token) throw Object.assign(new Error('Missing login token.'), { status: 401 });

  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    throw Object.assign(new Error('Your session has expired. Please login again.'), { status: 401 });
  }
}

export async function login(username, password) {
  const result = await pool.query('SELECT id, username, password_hash FROM users WHERE LOWER(username) = $1', [
    String(username || '').trim().toLowerCase(),
  ]);
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(String(password || ''), user.password_hash))) {
    throw Object.assign(new Error('Invalid username or password.'), { status: 401 });
  }

  return {
    token: jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '12h' }),
    user: { id: user.id, username: user.username },
  };
}

export function normalizeItem(body) {
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

export function validateItem(item) {
  const allowedTypes = new Set(['software', 'website', 'social', 'vault']);
  if (!allowedTypes.has(item.type)) return 'Choose a valid item type.';
  if (!item.name) return 'Name is required.';
  if (item.type === 'vault' && (!item.username || !item.password)) return 'Vault records need a username and password.';
  if (item.type !== 'vault' && !item.url) return 'A website link is required.';
  return null;
}

export function handleError(res, error) {
  return send(res, error.status || 500, { message: error.message || 'Server error. Please try again.' });
}
