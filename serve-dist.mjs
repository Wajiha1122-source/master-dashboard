import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { readFile } from 'node:fs/promises';

const port = Number(process.env.PORT || 4174);
const root = join(process.cwd(), 'dist');

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

function resolveRequest(url) {
  const cleanUrl = decodeURIComponent(url.split('?')[0]);
  const safePath = normalize(cleanUrl).replace(/^(\.\.[/\\])+/, '');
  return join(root, safePath === '/' ? 'index.html' : safePath);
}

createServer(async (request, response) => {
  try {
    const filePath = resolveRequest(request.url || '/');
    const file = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(file);
  } catch {
    const index = await readFile(join(root, 'index.html'));
    response.writeHead(200, { 'Content-Type': contentTypes['.html'] });
    response.end(index);
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`Fjgroup CEO Dashboard: http://localhost:${port}`);
});
