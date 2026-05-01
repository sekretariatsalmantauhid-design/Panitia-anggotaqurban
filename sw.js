// UBAH ANGKA INI SETIAP KALI BOS UPDATE index.html (Misal: v2, v3, v4)
const CACHE_NAME = 'qurban-appanggota-v3.4'; 

const urlsToCache = [
 './',
  './index.html',
  './manifest.json',
  './logo.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
];

// Install Service Worker & Paksa Langsung Aktif (Skip Waiting)
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache Qurban App versi baru siap!');
        return cache.addAll(urlsToCache);
      })
  );
});

// Strategi: Ambil dari Internet dulu, kalau gagal ambil dari Cache (Offline Mode)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// Bersihkan Cache versi lama saat update & Ambil alih layar
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Menghapus cache jadul:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); 
    })
  );
});