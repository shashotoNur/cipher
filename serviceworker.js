const CACHE_NAME = "version-1.0.0";
const urlsToCache = [ 'index.html' ];

const self = this;


// Install serviceworker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});


// Activate the serviceworker
self.addEventListener('activate', event => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
                if(!cacheWhitelist.includes(cacheName)) return caches.delete(cacheName);
            })
        })
    );
});