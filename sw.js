/* Infocelll Service Worker — improved caching strategy */
var CACHE_NAME = 'infocelll-v6';
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
  './fonts/phosphor.min.css',
  './fonts/Phosphor.woff2',
  './fonts/Phosphor-Fill.woff2',
  './logo.png',
  './favicon.svg'
];

/* Install (resilient: tolerate missing assets) */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.allSettled(ASSETS_TO_CACHE.map(function(asset){
        return cache.add(asset).catch(function(err){
          console.warn('SW cache.add failed for', asset, err && err.message);
          return null;
        });
      }));
    }).catch(function(err){
      console.error('SW open cache failed', err && err.message);
    })
  );
  self.skipWaiting();
});

/* Activate — remove old caches */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(
        names.filter(function(name){ return name !== CACHE_NAME; })
             .map(function(name){ return caches.delete(name); })
      );
    })
  );
  self.clients.claim();
});

/* Helpers */
function isStaticAsset(pathname) {
  return /\.(?:png|jpg|jpeg|webp|avif|svg|css|js|woff2|woff|ttf)$/.test(pathname);
}

/* Fetch strategy:
   - Bypass caching for admin page and non-critical third-party scripts (marketing)
   - HTML/page requests: network-first -> fallback to cache
   - Static assets (images, fonts, css): cache-first -> fetch and update cache in background
   - Others: network-first with cache fallback
*/
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  var url;
  try { url = new URL(event.request.url); } catch (e) { return; }

  // Only handle same-origin requests in SW
  if (url.origin !== location.origin) return;

  // Explicitly bypass certain paths (admin UI and marketing script)
  if (url.pathname.endsWith('/admin.html') || url.pathname.endsWith('/marketing.min.js')) {
    return; // let browser handle these requests (network)
  }

  // Navigation requests (HTML) -> network-first
  if (event.request.mode === 'navigate' || (event.request.headers.get && event.request.headers.get('accept') && event.request.headers.get('accept').indexOf('text/html') !== -1)) {
    event.respondWith(
      fetch(event.request).then(function(response){
        if (response && response.ok) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, clone).catch(function(){}); });
          return response;
        }
        return caches.match(event.request).then(function(cached){ return cached || caches.match('./index.html'); });
      }).catch(function(){
        return caches.match(event.request).then(function(cached){ return cached || caches.match('./index.html'); });
      })
    );
    return;
  }

  // Static assets (images, fonts, css, js) -> cache-first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then(function(cached){
        if (cached) return cached;
        return fetch(event.request).then(function(response){
          if (!response || !response.ok) return response;
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, clone).catch(function(){}); });
          return response;
        }).catch(function(){
          return cached || Promise.resolve(); // if nothing, undefined -> browser handles
        });
      })
    );
    return;
  }

  // Fallback for other requests -> network-first with cache fallback
  event.respondWith(
    fetch(event.request).then(function(response){
      if (!response || !response.ok) return response;
      var clone = response.clone();
      caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, clone).catch(function(){}); });
      return response;
    }).catch(function(){
      return caches.match(event.request);
    })
  );
});
