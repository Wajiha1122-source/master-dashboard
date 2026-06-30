import jwt from 'jsonwebtoken';
import { authenticate, handleError, parseBody, ready, send } from './_shared.js';

export default async function handler(req, res) {
  try {
    await ready;
    if (req.method !== 'POST') return send(res, 405, { message: 'Method not allowed.' });

    const user = authenticate(req);
    const body = parseBody(req);
    const appName = String(body.app || '').trim();
    const targetUrl = String(body.targetUrl || '').trim();

    if (!appName || !targetUrl || targetUrl.startsWith('#')) {
      return send(res, 400, { message: 'A valid software app and URL are required.' });
    }

    const baseUrl = targetUrl.replace(/\/+$/, '');
    const token = jwt.sign(
      {
        masterUser: user.username,
        role: 'ceo',
        app: appName,
        targetUrl: baseUrl,
      },
      process.env.SSO_SECRET || process.env.JWT_SECRET,
      {
        expiresIn: '60s',
        issuer: 'fjgroup-master-dashboard',
        audience: appName,
      },
    );

    return send(res, 200, {
      token,
      launchUrl: `${baseUrl}/sso-login?token=${encodeURIComponent(token)}`,
      expiresIn: 60,
    });
  } catch (error) {
    return handleError(res, error);
  }
}
