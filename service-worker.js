const CACHE_NAME = 'revisao-prf-v4.0.0'; // Mude o número da versão para forçar a atualização do cache
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // Note: Estes ícones precisam ser criados e colocados na sua pasta.
  './icon-192.png',
  './icon-512.png'
];

// Instala o Service Worker e armazena os assets principais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto e assets principais adicionados');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Falha ao adicionar URLs ao cache durante a instalação:', error);
      })
  );
  self.skipWaiting();
});

// Ativa o Service Worker e limpa caches antigos (para gerenciar versões)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Estratégia Cache First (Cache Primeiro)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se o recurso estiver no cache, retorna-o
        if (response) {
          return response;
        }
        // Caso contrário, tenta buscar na rede
        return fetch(event.request);
      })
  );
});