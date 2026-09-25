/* Service worker: deixa o roteiro disponível offline (sinal fraco na restinga e no barco). */
const VERSION = 'praia-seca-v6';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(['./', './index.html', './data/lugares.json', './manifest.webmanifest', './ilustracoes/casal.webp', './ilustracoes/offline.webp', './ilustracoes/404.webp']))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com');
  if (!sameOrigin && !isFont) return;

  // Navegação e dados: rede primeiro (pega atualizações), cache se estiver offline.
  if (request.mode === 'navigate' || url.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('./index.html')))
    );
    return;
  }
  // Arquivos estáticos (JS, CSS, fontes, ícones): cache primeiro.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          if (res.ok || res.type === 'opaque') {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(request, copy));
          }
          return res;
        })
    )
  );
});
