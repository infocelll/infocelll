/* Infocelll Service Worker v3.0 — Paths relativos para GitHub Pages */
var CACHE_NAME = 'infocelll-v5';
var ASSETS_TO_CACHE = [
  './',
  './index.html',
  './servicos.html',
  './contato.html',
  './sobre.html',
  './galeria.html',
  './agendamento.html',
  './avaliacoes.html',
  './dicas.html',
  './promocoes.html',
  './fidelidade.html',
  './politica-privacidade.html',
  './style.min.css',
  './script.min.js',
  './marketing.min.js',
  './fonts/phosphor.min.css',
  './fonts/Phosphor.woff2',
  './fonts/Phosphor-Fill.woff2',
  './logo.png',
  './favicon.svg'
];

/* Install (resilient) */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // Use add() per asset and tolerate failures so install doesn't fail if one file is missing
      return Promise.allSettled(ASSETS_TO_CACHE.map(function(asset) {
        return cache.add(asset).catch(function(err) {
          // log but don't reject install
          console.warn('SW cache.add failed for', asset, err && err.message);
          return null;
        });
      }));
    }).catch(function(err) {
      console.error('SW open cache failed', err && err.message);
    })
  );
  self.skipWaiting();
});

/* Activate — clean old caches */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

/* Fetch — Network first, fallback to cache */
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  var url = new URL(event.request.url);

  /* External requests: network only */
  if (url.origin !== location.origin) return;

  /* Skip admin and marketing from cache-first */
  if (url.pathname.endsWith('/admin.html') || url.pathname.endsWith('/marketing.js')) return;

  event.respondWith(
    fetch(event.request).then(function(response) {
      // Only cache successful responses
      if (!response || !response.ok) return response;
      var clone = response.clone();
      caches.open(CACHE_NAME).then(function(cache) {
        cache.put(event.request, clone).catch(function(err) {
          // ignore cache put failures
          console.warn('SW cache.put failed', err && err.message);
        });
      });
      return response;
    }).catch(function() {
      return caches.match(event.request).then(function(cached) {
        if (cached) return cached;
        try {
          if (event.request.headers.get('accept') && event.request.headers.get('accept').indexOf('text/html') !== -1) {
            return caches.match('./index.html');
          }
        } catch (e) { /* ignore */ }
      });
    })
  );
});
