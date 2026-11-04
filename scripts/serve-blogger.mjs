import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { renderPreview } from './lib/blogger-preview.mjs';

const args = process.argv.slice(2);
if (args.some((value, index) => index % 2 === 0 && !['--out', '--port'].includes(value)) || args.length % 2) throw new Error('Usage: npm run preview:blogger -- [--out directory] [--port 4175]');
const options = Object.fromEntries(Array.from({ length: args.length / 2 }, (_, index) => [args[index * 2], args[index * 2 + 1]]));
const out = path.resolve(import.meta.dirname, '..', options['--out'] || 'blogger/output');
const template = await fs.readFile(path.join(out, 'iamrusiru-blogger.xml'), 'utf8');
const { config, posts, pages } = JSON.parse(await fs.readFile(path.join(out, 'content.json'), 'utf8'));
const media = new Map(Object.entries(JSON.parse(await fs.readFile(path.join(out, 'media-manifest.json'), 'utf8'))));
const port = Number(options['--port'] || process.env.BLOGGER_PREVIEW_PORT || 4175);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid preview port');
const origin = 'http://127.0.0.1:' + port;
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, origin);
    if (url.pathname === '/favicon.ico') {
      res.writeHead(200, { 'Content-Type': 'image/x-icon' });
      res.end(await fs.readFile(path.resolve(import.meta.dirname, '../public/favicon.ico'))); return;
    }
    if (url.pathname.startsWith('/assets/')) {
      const name = decodeURIComponent(url.pathname.slice(8));
      if (!media.has(name)) { res.writeHead(404).end(); return; }
      const image = await fs.readFile(path.join(out, 'assets', name));
      res.writeHead(200, { 'Content-Type': name.endsWith('.png') ? 'image/png' : 'image/jpeg' });
      res.end(image); return;
    }
    if (url.pathname.startsWith('/feeds/')) {
      const label = decodeURIComponent(url.pathname.split('/-/')[1] || '');
      const matches = posts.filter(p => !label || p.labels.includes(label));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ feed: { entry: matches.slice(0, 6).map(p => ({ title: { $t: p.title }, link: [{ rel: 'alternate', href: origin + p.path }] })) } }));
      return;
    }
    let kind = 'home', post, viewTitle;
    let selected = posts;
    if (url.pathname.startsWith('/search/label/')) {
      const label = decodeURIComponent(url.pathname.slice('/search/label/'.length));
      viewTitle = 'Posts tagged: ' + label;
      selected = posts.filter(p => p.labels.includes(label));
      kind = selected.length ? 'listing' : 'empty';
    } else if (url.pathname === '/search') {
      const query = (url.searchParams.get('q') || '').toLowerCase();
      viewTitle = 'Search results for: ' + query;
      selected = posts.filter(p => (p.title + ' ' + p.excerpt + ' ' + p.labels.join(' ')).toLowerCase().includes(query));
      if (url.searchParams.has('updated-max')) selected = selected.slice(6);
      kind = selected.length ? 'listing' : 'empty';
    } else if (url.pathname !== '/') {
      if (/^\/\d{4}\/\d{2}\/$/.test(url.pathname)) {
        selected = posts.filter(p => p.path.startsWith(url.pathname));
        kind = 'archive'; viewTitle = url.pathname.slice(1, -1).replace('/', ' / ');
      } else {
      post = posts.find(p => p.path === url.pathname);
      kind = post ? 'post' : 'error';
      if (!post) { post = pages.find(p => p.path === url.pathname); if (post) kind = 'page'; }
      }
    }
    res.writeHead(kind === 'error' ? 404 : 200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderPreview(template, { config: { ...config, blogUrl: origin }, posts: selected, media, kind, post: post || selected[0] || posts[0], assetPrefix: '/assets/', viewTitle }));
  } catch (error) {
    console.error(error);
    res.writeHead(500).end('Preview error. See the terminal.');
  }
}).listen(port, '127.0.0.1', () => console.log('Blogger approximation preview: ' + origin + '\nNative comments and Blogger theme compilation require a Blogger test blog.'));
