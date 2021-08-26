const CACHE_NAME = "cache-version-1.0.0";
const urlsToCache = [
    '/',
    '/index.html',
    '/img/favicon.ico',
    '/img/logo192.png',
    '/img/logo512.png',
];
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


// Handle fetch events
self.addEventListener('fetch', event => {
    event.respondWith(async function() {
        try{
            const res = await fetch(event.request);
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request.url, res.clone());
            return res;
        }
        catch(error){
            console.log(error);
        }
    }());
});