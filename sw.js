// English Lab — offline cache. Bump VERSION on every publish so phones pick up the new content.
const VERSION = 'el-v7';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))); self.clients.claim(); });
// network first (gets updates when online), cache as fallback (works offline)
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)).catch(()=>{}); return r; })
    .catch(() => caches.match(e.request).then(m => m || caches.match('./index.html'))));
});
