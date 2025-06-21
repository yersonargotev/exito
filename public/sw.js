// public/sw.js - Service Worker para PWA
const CACHE_NAME = 'exito-store-v1.0.0';
const STATIC_CACHE_NAME = 'exito-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'exito-dynamic-v1.0.0';

// Recursos estáticos para cachear
const STATIC_ASSETS = [
  '/',
  '/cart',
  '/offline',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/og.png'
];

// URLs de API para cachear dinámicamente
const API_URLS = [
  'https://fakestoreapi.com/products',
  'https://fakestoreapi.com/products/categories'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache de recursos estáticos
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Forzar activación inmediata
      self.skipWaiting()
    ])
  );
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Limpiar caches antiguos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName !== CACHE_NAME
            ) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Tomar control inmediato de las páginas
      self.clients.claim()
    ])
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo manejar requests del mismo origen o APIs conocidas
  if (
    !url.origin.includes(self.location.origin) &&
    !API_URLS.some(apiUrl => url.href.startsWith(apiUrl))
  ) {
    return;
  }

  // Estrategia de cache según el tipo de request
  if (request.method === 'GET') {
    if (isStaticAsset(request.url)) {
      // Cache First para assets estáticos
      event.respondWith(cacheFirst(request));
    } else if (isAPIRequest(request.url)) {
      // Network First para API requests
      event.respondWith(networkFirst(request));
    } else {
      // Stale While Revalidate para páginas HTML
      event.respondWith(staleWhileRevalidate(request));
    }
  }
});

// Cache First Strategy
async function cacheFirst(request) {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache First failed:', error);
    return new Response('Offline content not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network First Strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);
    
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback para productos cuando no hay cache
    if (request.url.includes('products')) {
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw error;
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Fetch en background para actualizar cache
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch((error) => {
    console.error('[SW] Background fetch failed:', error);
  });
  
  // Retornar cached response inmediatamente si existe
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Si no hay cache, esperar el network response
  try {
    return await fetchPromise;
  } catch (error) {
    // Fallback a página offline
    const offlineResponse = await cache.match('/offline');
    return offlineResponse || new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Helpers
function isStaticAsset(url) {
  return url.includes('/_next/static/') ||
         url.includes('/images/') ||
         url.endsWith('.png') ||
         url.endsWith('.jpg') ||
         url.endsWith('.jpeg') ||
         url.endsWith('.svg') ||
         url.endsWith('.ico') ||
         url.endsWith('.css') ||
         url.endsWith('.js');
}

function isAPIRequest(url) {
  return API_URLS.some(apiUrl => url.startsWith(apiUrl)) ||
         url.includes('/api/');
}

// Background Sync para acciones offline
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCartData());
  }
});

async function syncCartData() {
  try {
    // Implementar sincronización de carrito cuando vuelva la conexión
    console.log('[SW] Syncing cart data...');
    // Aquí se implementaría la lógica de sync del carrito
  } catch (error) {
    console.error('[SW] Cart sync failed:', error);
  }
}

// Push notifications (futuro)
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización disponible',
    icon: '/web-app-manifest-192x192.png',
    badge: '/web-app-manifest-192x192.png',
    tag: 'exito-notification',
    renotify: true,
    actions: [
      {
        action: 'open',
        title: 'Ver ahora'
      },
      {
        action: 'close',
        title: 'Cerrar'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Éxito Store', options)
  );
});

// Manejo de clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
