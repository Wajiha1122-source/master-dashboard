import { handleError, login, parseBody, ready, send } from '../_shared.js';

export default async function handler(req, res) {
  try {
    await ready;
    if (req.method !== 'POST') return send(res, 405, { message: 'Method not allowed.' });

    const body = parseBody(req);
    const data = await login(body.username, body.password);
    return send(res, 200, data);
  } catch (error) {
    return handleError(res, error);
  }
}
