const cacheName = 'sohbet-pwa-v1';
const assets = [
  './',
  './index.html',
  './app.js',
  './firebaseConfig.js',
  './açılış .mp4',
  './uygulamaici.mp4',
  './icon-192.png',
  './icon-512.png',
  './google-symbol.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
