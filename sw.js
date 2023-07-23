const filesToCache = [
        'pages/offline.html',
        'pages/404.html',
        'assets/js/script.js',
        'components/header.js',
];

const staticCacheName = 'v5';

self.addEventListener('install', event => {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
        caches.open(staticCacheName)
        .then(cache => {
            return cache.addAll(filesToCache);
        })
    );
    self.skipWaiting();
})
self.addEventListener('activate', event => {
    console.log('Activating new service worker...');
    const cacheAllowlist = [staticCacheName];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheAllowlist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
})
self.addEventListener('fetch', event => {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                console.log('Found ', event.request.url, ' in cache');
                return response;
            }
            console.log('Network request for ', event.request.url);
            return fetch(event.request)
                .then(response => {
                    // TODO 5 - Respond with custom 404 page
                    return caches.open(staticCacheName).then(cache => {
                        cache.put(event.request.url, response.clone());
                        return response;
                    });
                });
        }).catch(error => {
            // TODO 6 - Respond with custom offline page
        })
    );
});