import crypto from 'node:crypto';
import { authenticate, handleError, normalizeItem, parseBody, pool, ready, send, validateItem } from '../_shared.js';

export default async function handler(req, res) {
  try {
    await ready;
    authenticate(req);

    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM dashboard_items ORDER BY created_at ASC');
      return send(res, 200, { items: result.rows });
    }

    if (req.method === 'POST') {
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

    return send(res, 405, { message: 'Method not allowed.' });
  } catch (error) {
    return handleError(res, error);
  }
}
