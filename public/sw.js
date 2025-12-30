const CACHE_NAME = 'portfolio-v2'
const STATIC_CACHE = 'static-v2'
const DYNAMIC_CACHE = 'dynamic-v2'
const IMAGE_CACHE = 'images-v2'

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/fonts/MonumentExtended-Ultrabold.otf',
  '/fonts/MonumentExtended.otf',
  '/assets/resume.pdf',
  '/assets/projects.json'
]

const CACHE_STRATEGIES = {
  static: ['/assets/fonts/', '/assets/css/', '/assets/js/'],
  images: ['/assets/images/', '/assets/20x/'],
  api: ['/api/', 'firestore.googleapis.com']
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!['static-v2', 'dynamic-v2', 'images-v2'].includes(cacheName)) {
              return caches.delete(cacheName)
            }
          })
        )
      }),
      self.clients.claim()
    ])
  )
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Handle different cache strategies
  if (request.method === 'GET') {
    // Static assets - Cache First
    if (CACHE_STRATEGIES.static.some(path => url.pathname.includes(path))) {
      event.respondWith(cacheFirst(request, STATIC_CACHE))
    }
    // Images - Cache First with fallback
    else if (CACHE_STRATEGIES.images.some(path => url.pathname.includes(path))) {
      event.respondWith(cacheFirst(request, IMAGE_CACHE))
    }
    // API calls - Network First
    else if (CACHE_STRATEGIES.api.some(path => url.hostname.includes(path))) {
      event.respondWith(networkFirst(request, DYNAMIC_CACHE))
    }
    // HTML pages - Network First with offline fallback
    else if (request.headers.get('accept').includes('text/html')) {
      event.respondWith(networkFirst(request, DYNAMIC_CACHE, '/'))
    }
    // Other resources - Stale While Revalidate
    else {
      event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE))
    }
  }
})

// Cache First Strategy
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
    return new Response('Offline', { status: 503 })
  }
}

// Network First Strategy
async function networkFirst(request, cacheName, fallbackUrl = null) {
  const cache = await caches.open(cacheName)
  
  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await cache.match(request)
    if (cached) {
      return cached
    }
    
    if (fallbackUrl) {
      const fallback = await cache.match(fallbackUrl)
      if (fallback) {
        return fallback
      }
    }
    
    return new Response('Offline', { status: 503 })
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  })
  
  return cached || fetchPromise
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

// Share target API handler
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  
  if (url.pathname === '/share' && event.request.method === 'GET') {
    const params = new URLSearchParams(url.search)
    const title = params.get('title') || ''
    const text = params.get('text') || ''
    const shareUrl = params.get('url') || ''
    
    event.respondWith(
      Response.redirect(`/?shared=true&title=${encodeURIComponent(title)}&text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`)
    )
    return
  }
  
  // Existing fetch handler logic...
  const { request } = event
  const requestUrl = new URL(request.url)

  // Handle different cache strategies
  if (request.method === 'GET') {
    // Static assets - Cache First
    if (CACHE_STRATEGIES.static.some(path => requestUrl.pathname.includes(path))) {
      event.respondWith(cacheFirst(request, STATIC_CACHE))
    }
    // Images - Cache First with fallback
    else if (CACHE_STRATEGIES.images.some(path => requestUrl.pathname.includes(path))) {
      event.respondWith(cacheFirst(request, IMAGE_CACHE))
    }
    // API calls - Network First
    else if (CACHE_STRATEGIES.api.some(path => requestUrl.hostname.includes(path))) {
      event.respondWith(networkFirst(request, DYNAMIC_CACHE))
    }
    // HTML pages - Network First with offline fallback
    else if (request.headers.get('accept').includes('text/html')) {
      event.respondWith(networkFirst(request, DYNAMIC_CACHE, '/'))
    }
    // Other resources - Stale While Revalidate
    else {
      event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE))
    }
  }
})

async function doBackgroundSync() {
  // Handle offline form submissions, analytics, etc.
  console.log('Background sync triggered')
  
  // Process queued analytics events
  const queuedEvents = await getQueuedEvents()
  for (const event of queuedEvents) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        body: JSON.stringify(event)
      })
      await removeQueuedEvent(event.id)
    } catch (error) {
      console.log('Failed to sync event:', error)
    }
  }
}

async function getQueuedEvents() {
  // Implementation for retrieving queued events from IndexedDB
  return []
}

async function removeQueuedEvent(id) {
  // Implementation for removing synced events
}