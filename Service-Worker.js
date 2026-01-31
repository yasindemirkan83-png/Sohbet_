const CACHE_NAME = "sohbet-app-v1";
const urlsToCache = [
  "./index.html",
  "./app.js",
  "./firebaseConfig.js",
  "./manifest.json",
  "./google-symbol.png",
  "./icon-192.png",
  "./icon-512.png",
  "./uygulamaici.mp4",
  "./açılış .mp4",
  "./style.css"  // Eğer ayrı CSS varsa
];

// Install Event
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if(key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
