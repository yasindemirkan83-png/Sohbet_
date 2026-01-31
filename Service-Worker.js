const CACHE_NAME = "anfa-app-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./app.js",
  "./firebaseConfig.js",
  "./icon-192.png",
  "./icon-512.png",
  "./uygulamaici.mp4",
  "./açılış .mp4",
  "./google-symbol.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache açıldı ve dosyalar eklendi");
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

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});
