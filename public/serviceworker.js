const self = this;

const CACHE_NAME = "cache-v1";
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/favicon.ico',
    '/icons/logo192.png',
    '/icons/logo512.png',
    'https://jimmywarting.github.io/StreamSaver.js/mitm.html?version=2.0.0'
];


// Install serviceworker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlsToCache);
        })
        );
    console.log('Worker installed! 👍');
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
    console.log('Worker activated! 👍');
});

// Handle fetch events
self.addEventListener('fetch', event => {
    event.respondWith(async function() {
        try
        {
            const res = await fetch(event.request);
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request.url, res.clone());

            return res;
        }
        catch({ message })
        {
            const cache = await caches.open(CACHE_NAME);
            const res = await cache.match(event.request.url);

            return res;
        };
    }());
});