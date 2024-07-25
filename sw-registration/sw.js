// Files to cache
const cacheName = 'pureSW';
const appShellFiles = [];

const contentToCache = appShellFiles;

// Installing Service Worker
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all: app shell and content', contentToCache);
    await cache.addAll(contentToCache);
  })());
});

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
  // Cache http and https only, skip unsupported chrome-extension:// and file://...
  if (!(
    e.request.url.startsWith('http:') || e.request.url.startsWith('https:')
  )) {
    return;
  }
  // 此处还可以进一步细化，缓存过期时间，有些资源不能缓存，有些资源永久缓存等等
  // 这里给出一个有限取缓存，缓存没有取网络资源的示例
  e.respondWith((async () => {
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching cache: ${e.request.url}`);
    if (r) return r;
    const response = await fetch(e.request);
    console.log(`[Service Worker] Fetching new resource: ${e.request.url}`);
    const cache = await caches.open(cacheName);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});
