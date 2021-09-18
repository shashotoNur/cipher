
const self = this;
const CACHE_NAME = "cipher@0.0.1";


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