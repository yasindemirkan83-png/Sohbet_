const CACHE_NAME = "sohbet-pwa-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./app.js",
  "./firebaseConfig.js",
  "./manifest.json",
  "./google-symbol.png",
  "./icon-192.png",
  "./icon-512.png",
  "./açılış .mp4",
  "./uygulamaici.mp4"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
