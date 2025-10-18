const CACHE_NAME = 'nekobox-cache';

self.addEventListener('install', event => {
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});