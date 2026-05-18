const CACHE_NAME = 'cne-tesouraria-v8-cache-v2';

const CORE_ASSETS = [
  './',
  './dashboard.html',
  './configuracoes.html',
  './relatorios.html',
  './teste-operacional.html',
  './css/style.css',
  './js/utils.js',
  './js/trimestre.js',
  './js/supabase.js',
  './js/branding.js',
  './js/financeiro.js',
  './js/realtime.js',
  './js/offline.js',
  './js/dashboard.js',
  './js/configuracoes.js',
  './js/relatorios.js',
  './js/atividades.js',
  './js/validacoes.js',
  './js/contagens.js',
  './js/auditoria.js',
  './js/pwa.js',
  './js/indexeddb.js',
  './js/sync-queue.js',
  './js/report-utils.js',
  './js/relatorio-render.js',
  './js/relatorio-tabelas.js',
  './js/relatorio-filtros.js',
  './js/status-ui.js',
  './js/performance.js',
  './js/auto-snapshots.js',
  './js/anti-duplicados.js',
  './js/conflitos.js',
  './js/trimestre-fecho.js',
  './js/github-pages.js',
  './js/transferencias.js',
  './js/soft-delete.js',
  './manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          const clone = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, clone));

          return response;
        })
        .catch(() => caches.match('./teste-operacional.html'));
    })
  );
});