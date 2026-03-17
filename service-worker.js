self.addEventListener('install', function(event){
  console.log('Service Worker installed');
  self.skipWaiting();
});
self.addEventListener('activate', function(event){
  console.log('Service Worker activated');
});
self.addEventListener('fetch', function(event){
  // 네트워크를 사용하되 실패하면 캐시(없으면 실패)
  event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
});
