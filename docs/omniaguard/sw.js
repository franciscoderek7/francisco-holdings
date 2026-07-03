const CACHE_NAME = 'omniaguard-v1';
const urlsToCache = [
  '/omniaguard/',
  '/omniaguard/index.html',
  '/omniaguard/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(names => Promise.all(names.map(n => { if(n !== CACHE_NAME) return caches.delete(n); }))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});