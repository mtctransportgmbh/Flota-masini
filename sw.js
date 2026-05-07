const CACHE = 'flota-v4';
const ASSETS = ['./', './index.html', './manifest.json', './config.js', './firebase-messaging-sw.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  // Activare imediată — nu așteaptă ca tab-urile vechi să se închidă
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('firebaseio') || url.includes('googleapis') || url.includes('firebase') || url.includes('gstatic')) {
    return;
  }
  // Network-first: mereu încearcă rețeaua, cache doar pentru offline
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        if (e.request.method === 'GET' && resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});

self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
