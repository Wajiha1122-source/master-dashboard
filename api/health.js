import { handleError, ready, send } from './_shared.js';

export default async function handler(req, res) {
  try {
    await ready;
    if (req.method !== 'GET') return send(res, 405, { message: 'Method not allowed.' });
    return send(res, 200, { ok: true });
  } catch (error) {
    return handleError(res, error);
  }
}
