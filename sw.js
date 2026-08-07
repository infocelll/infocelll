/* Infocelll Service Worker v4.1 — Paths relativos para GitHub Pages */
var CACHE_NAME = 'infocelll-v9';
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
  './fonts/inter-latin.woff2',
  './fonts/inter-latin-ext.woff2',
  './fonts/spacegrotesk-latin.woff2',
  './fonts/spacegrotesk-latin-ext.woff2',
  './fonts/jetbrains-mono-latin.woff2',
  './fonts/jetbrains-mono-latin-ext.woff2',
  './logo.png',
  './logo.webp',
  './favicon.svg'
];

/* Static asset extensions served cache-first (stale-while-revalidate) */
var STATIC_EXT = ['css', 'js', 'woff2', 'woff', 'png', 'svg', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'ico', 'xml', 'json', 'txt'];

function isStaticAsset(url) {
  var path = url.pathname.split('?')[0].toLowerCase();
  for (var i = 0; i < STATIC_EXT.length; i++) {
    if (path.endsWith('.' + STATIC_EXT[i])) return true;
  }
  return false;
}

function isHtmlRequest(request) {
  var accept = (request.headers.get('accept') || '').indexOf('text/html') !== -1;
  return request.mode === 'navigate' || accept;
}

/* Install */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS_TO_CACHE);
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

/* Fetch — HTML: network first, fallback cache.
   Static assets: cache first, revalidate in background. */
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  var url = new URL(event.request.url);

  /* External requests: network only */
  if (url.origin !== location.origin) return;

  /* Skip admin and marketing from caching */
  if (url.pathname.endsWith('/admin.html') || url.pathname.endsWith('/marketing.js')) return;

  /* HTML documents: network first */
  if (isHtmlRequest(event.request)) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          }).catch(function() {});
        }
        return response;
      }).catch(function() {
        return caches.match(event.request).then(function(cached) {
          if (cached) return cached;
          if (isHtmlRequest(event.request)) {
            return caches.match('./index.html');
          }
          return undefined;
        });
      })
    );
    return;
  }

  /* Static assets: cache first, revalidate in background */
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        var networkFetch = fetch(event.request).then(function(response) {
          if (response && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, clone);
            }).catch(function() {});
          }
          return response;
        }).catch(function() {
          return undefined;
        });
        if (cached) {
          event.waitUntil(networkFetch);
          return cached;
        }
        return networkFetch.then(function(response) {
          return response || cached;
        });
      })
    );
    return;
  }

  /* Anything else: network only */
  event.respondWith(fetch(event.request));
});
