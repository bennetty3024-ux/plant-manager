self.addEventListener('install',function(e){
self.skipWaiting()
})

self.addEventListener('fetch',function(event){
event.respondWith(fetch(event.request))
})
