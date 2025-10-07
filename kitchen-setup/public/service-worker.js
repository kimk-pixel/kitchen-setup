self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('kitchen-setup-v1').then((cache) => cache.addAll([
      '/',
      '/manifest.webmanifest',
      '/index.html'
    ]))
  );
});
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});