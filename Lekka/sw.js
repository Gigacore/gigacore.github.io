const CACHE_NAME = 'lekka-cache-v1';
const CACHE_EXPIRATION = 12 * 60 * 60 * 1000; // 12 hours

const a = async () => {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    for (const key of keys) {
        const response = await cache.match(key);
        if (response) {
            const dateHeader = response.headers.get('date');
            if (dateHeader) {
                const fetchDate = new Date(dateHeader).getTime();
                if (Date.now() > fetchDate + CACHE_EXPIRATION) {
                    await cache.delete(key);
                }
            }
        }
    }
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/script.js',
                '/icon/lekka.png'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(a());
});
