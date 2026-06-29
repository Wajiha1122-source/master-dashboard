import { authenticate, handleError, normalizeItem, parseBody, pool, ready, send, validateItem } from '../_shared.js';

export default async function handler(req, res) {
  try {
    await ready;
    authenticate(req);

    const id = req.query.id;

    if (req.method === 'PUT') {
      const item = normalizeItem(parseBody(req));
      const error = validateItem(item);
      if (error) return send(res, 400, { message: error });

      const result = await pool.query(
        `UPDATE dashboard_items
         SET type = $2, name = $3, label = $4, description = $5, company = $6, platform = $7,
             url = $8, username = $9, password = $10, notes = $11, updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id, item.type, item.name, item.label, item.description, item.company, item.platform, item.url, item.username, item.password, item.notes],
      );
      if (!result.rowCount) return send(res, 404, { message: 'Record not found.' });
      return send(res, 200, { item: result.rows[0] });
    }

    if (req.method === 'DELETE') {
      const result = await pool.query('DELETE FROM dashboard_items WHERE id = $1', [id]);
      if (!result.rowCount) return send(res, 404, { message: 'Record not found.' });
      return send(res, 204);
    }

    return send(res, 405, { message: 'Method not allowed.' });
  } catch (error) {
    return handleError(res, error);
  }
}
