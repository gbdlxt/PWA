self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});
self.addEventListener('activate', () => {
  console.log('[Service Worker] activate')
});
self.addEventListener('fetch', (e) => {
  console.log('[Service Worker] fetch');
});
