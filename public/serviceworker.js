const self = this;

const CACHE_NAME = "cache-v1";
const urlsToCache = [
    '/encryptor/',
    '/encryptor/index.html',
    '/encryptor/img/favicon.ico',
    '/encryptor/img/logo192.png',
    '/encryptor/img/logo512.png',
];


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
        try {
            const res = await fetch(event.request);
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request.url, res.clone());
            return res;
        }
        catch(error) { console.log(error); };
    }());
});