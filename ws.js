// Nome do cache (pode ser qualquer nome)
const CACHE_NAME = 'meu-app-cache-v1';

// Arquivos que você quer que funcionem mesmo offline (opcional)
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Instala o Service Worker e guarda os arquivos no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Responde às requisições do site usando o cache quando estiver offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se achou no cache, manda o cache. Se não, busca na internet.
        return response || fetch(event.request);
      })
  );
});
 