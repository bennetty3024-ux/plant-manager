self.addEventListener('install',function(event){
console.log('Service Worker installed');
self.skipWaiting();
});

self.addEventListener('activate',function(event){
console.log('Service Worker activated');
});

self.addEventListener('fetch',function(event){
event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
});
