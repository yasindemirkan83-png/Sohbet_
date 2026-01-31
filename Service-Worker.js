const CACHE_NAME = "anfa-pwa-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./app.js",
  "./firebaseConfig.js",
  "./icon-192.png",
  "./icon-512.png",
  "./uygulamaici.mp4",
  "./google-symbol.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response=>{
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", event=>{
  const cacheWhitelist=[CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.map(key=>{
        if(!cacheWhitelist.includes(key)) return caches.delete(key);
      })
    ))
  );
});
