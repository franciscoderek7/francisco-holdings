const CACHE_NAME = 'primedox-v2';
const urlsToCache = [
  '/primedox/',
  '/primedox/index.html',
  '/primedox/manifest.json',
  '/primedox/icon-192.png',
  '/primedox/icon-512.png'
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