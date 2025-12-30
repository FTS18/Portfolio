// Service Worker with Auto-Update Cache Strategy
// Change this version to force cache refresh
const SW_VERSION = 'v4-' + Date.now()
const CACHE_NAME = 'portfolio-' + SW_VERSION
const STATIC_CACHE = 'static-' + SW_VERSION
const DYNAMIC_CACHE = 'dynamic-' + SW_VERSION
const IMAGE_CACHE = 'images-' + SW_VERSION

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/fonts/MonumentExtended.woff2',
  '/fonts/MonumentExtended-Ultrabold.woff2',
  // Fallback OTF for older browsers
  '/fonts/MonumentExtended.otf',
  '/fonts/MonumentExtended-Ultrabold.otf'
]

// Don't cache these - always fetch fresh
const NEVER_CACHE = [
  '/api/',
  'firestore.googleapis.com',
  'firebase',
  'hot-update',
  '__vite',
  'localhost:',
  'ghchart.rshah.org',
  'api.github.com',
  'api.ipify.org'
]

// Cache durations (in seconds)
const CACHE_DURATIONS = {
  static: 86400 * 7,   // 7 days for static assets
  images: 86400 * 30,  // 30 days for images
  dynamic: 86400       // 1 day for dynamic content
}

// Install - cache minimal static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing new version:', SW_VERSION)
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => {
        console.log('[SW] Skip waiting, activating immediately')
        return self.skipWaiting()
      })
  )
})

// Activate - ALWAYS clear ALL old caches when new SW activates
self.addEventListener('activate', event => {
  console.log('[SW] Activating new version:', SW_VERSION)
  event.waitUntil(
    Promise.all([
      // Delete ALL old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Delete any cache that doesn't match current version
            if (!cacheName.includes(SW_VERSION)) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // Take control of all pages immediately
      self.clients.claim()
    ]).then(() => {
      // Notify all clients that SW has been updated
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'SW_UPDATED', version: SW_VERSION })
        })
      })
    })
  )
})

// Fetch handler with smart caching
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip requests that should never be cached
  if (NEVER_CACHE.some(pattern => request.url.includes(pattern))) {
    return
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!request.url.startsWith('http')) {
    return
  }

  // Determine caching strategy based on request type
  if (isStaticAsset(url)) {
    // Static assets: Stale-While-Revalidate (serve cache, update in background)
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE))
  } else if (isImageAsset(url)) {
    // Images: Cache first, network fallback
    event.respondWith(cacheFirst(request, IMAGE_CACHE))
  } else if (isHTMLPage(request)) {
    // HTML: Network first, cache fallback (always try to get fresh HTML)
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
  } else {
    // Everything else: Stale-While-Revalidate
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE))
  }
})

// Helper functions
function isStaticAsset(url) {
  return url.pathname.match(/\.(js|css|woff|woff2|otf|ttf)(\?.*)?$/) ||
    url.pathname.includes('/assets/fonts/') ||
    url.pathname.includes('/assets/css/') ||
    url.pathname.includes('/assets/js/')
}

function isImageAsset(url) {
  return url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)(\?.*)?$/) ||
    url.pathname.includes('/assets/images/') ||
    url.pathname.includes('/assets/20x/')
}

function isHTMLPage(request) {
  const accept = request.headers.get('accept') || ''
  return accept.includes('text/html')
}

// Network First Strategy - Always try network, fall back to cache
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)

  try {
    const response = await fetch(request)
    if (response.ok) {
      // Clone and cache the fresh response
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    // Network failed, try cache
    const cached = await cache.match(request)
    if (cached) {
      console.log('[SW] Serving from cache (offline):', request.url)
      return cached
    }

    // If requesting HTML and no cache, return root
    if (isHTMLPage(request)) {
      const fallback = await cache.match('/')
      if (fallback) return fallback
    }

    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
  }
}

// Cache First Strategy - Check cache first, then network
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  if (cached) {
    return cached
  }

  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    return new Response('Asset not available', { status: 503 })
  }
}

// Stale While Revalidate - Return cache immediately, update in background
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  // Always fetch fresh version in background
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        // Update cache with fresh response
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(error => {
      console.log('[SW] Network fetch failed:', request.url)
      return null
    })

  // Return cached version immediately, or wait for network
  if (cached) {
    return cached
  }

  const networkResponse = await fetchPromise
  if (networkResponse) {
    return networkResponse
  }

  return new Response('Resource not available', { status: 503 })
}

// Listen for skip waiting message from client
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    console.log('[SW] Received skip waiting message')
    self.skipWaiting()
  }

  if (event.data === 'CLEAR_ALL_CACHES') {
    console.log('[SW] Clearing all caches')
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name))
    })
  }
})

// Background sync
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  console.log('[SW] Background sync triggered')
}