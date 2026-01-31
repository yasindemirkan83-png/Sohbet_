const CACHE_NAME='anfa-pwa-cache-v1';
const urlsToCache=[
  '/',
  '/index.html',
  '/icon-192.png',
  '/icon-512.png',
  '/uygulamaici.mp4',
  '/açılış .mp4',
  '/google-symbol.png',
  'https://www.gstatic.com/firebasejs/10.6.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.6.1/firebase-database.js',
  'https://www.gstatic.com/firebasejs/10.6.1/firebase-auth.js'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(urlsToCache)));
});

self.addEventListener('fetch',event=>{
  event.respondWith(caches.match(event.request).then(resp=>resp || fetch(event.request)));
});

self.addEventListener('activate',event=>{
  const whitelist=[CACHE_NAME];
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>!whitelist.includes(k)?caches.delete(k):null))));
});
