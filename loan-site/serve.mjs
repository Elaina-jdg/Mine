/**
 * serve.mjs —— 零依赖本地静态服务器(用于预览这个网站)
 * 用法:node serve.mjs [端口]     默认 8420
 * 例:  node serve.mjs 8420  → http://127.0.0.1:8420
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)));
const PORT = Number(process.argv[2] || 8420);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.csv': 'text/csv; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2'
};

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let target = resolve(join(ROOT, urlPath));

    // 防目录穿越:必须仍在站点根目录内
    if (target !== ROOT && !target.startsWith(ROOT + sep)) {
      res.writeHead(403).end('403 Forbidden');
      return;
    }

    let info = await stat(target).catch(() => null);
    if (info && info.isDirectory()) {
      target = join(target, 'index.html');
      info = await stat(target).catch(() => null);
    }
    if (!info || !info.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('404 Not Found: ' + urlPath);
      return;
    }

    const body = await readFile(target);
    res.writeHead(200, {
      'Content-Type': MIME[extname(target).toLowerCase()] || 'application/octet-stream',
      'Content-Length': body.length,
      'Cache-Control': 'no-cache'
    }).end(body);
    console.log(new Date().toLocaleTimeString('zh-CN'), req.method, urlPath, '->', 200);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end('500 ' + err.message);
    console.error('ERROR', err.message);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用,请换一个端口,例如:node serve.mjs ${PORT + 1}`);
  } else {
    console.error('服务器错误:', err.message);
  }
  process.exit(1);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('静态服务器已启动');
  console.log('站点目录: ' + ROOT);
  console.log('访问地址: http://127.0.0.1:' + PORT + '/');
});
