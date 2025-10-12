// PixelTunes Web - Service Worker for Offline Support

const CACHE_NAME = 'pixeltunes-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    'https://fonts.googleapis.com/css2?family=VT323&display=swap'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache.map(url => {
                    // Handle relative URLs
                    if (url.startsWith('/')) {
                        return new Request(url, { cache: 'reload' });
                    }
                    return url;
                })).catch(err => {
                    console.log('Error caching resources:', err);
                    // Don't fail installation if some resources can't be cached
                    return Promise.resolve();
                });
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Helper function to check if URL is allowed
function isAllowedUrl(urlString) {
    try {
        const url = new URL(urlString);
        // Allow same-origin requests
        if (url.origin === self.location.origin) {
            return true;
        }
        // Allow Google Fonts (exact hostnames only)
        if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests that aren't explicitly allowed
    if (!isAllowedUrl(event.request.url)) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Clone the request
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then((response) => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }
                    
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    // Cache the fetched resource
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            // Only cache allowed URLs
                            if (isAllowedUrl(event.request.url)) {
                                cache.put(event.request, responseToCache);
                            }
                        });
                    
                    return response;
                }).catch(() => {
                    // Network request failed, try to return a cached fallback
                    console.log('Fetch failed; returning offline page instead.');
                    return caches.match('/index.html');
                });
            })
    );
});
