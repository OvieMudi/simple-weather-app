const precacheRescourses = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/public/css/index.css',
  '/public/assets/images/pexels-sam-willis-1166991.jpg',
  '/public/assets/icons/android-icon-36x36.png',
  '/public/assets/icons/android-icon-48x48.png',
  '/public/assets/icons/android-icon-72x72.png',
  '/public/assets/icons/android-icon-96x96.png',
  '/public/assets/icons/android-icon-144x144.png',
  '/public/assets/icons/android-icon-192x192.png',
  '/public/assets/icons/apple-icon.png',
  '/public/assets/icons/apple-icon-180x180.png',
  '/public/assets/icons/apple-icon-precomposed.png',
  '/public/assets/icons/favicon-16x16.png',
  '/public/assets/icons/favicon-32x32.png',
  '/public/assets/icons/favicon-96x96.png',
  '/public/assets/icons/ms-icon-70x70.png',
  '/public/assets/icons/ms-icon-144x144.png',
  '/public/assets/icons/ms-icon-150x150.png',
];

const staticCacheName = 'cache-v1';
const cacheWhiteList = [staticCacheName];

self.addEventListener('install', (event) => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches
      .open(staticCacheName)
      .then((cache) => {
        return cache.addAll(precacheRescourses);
      })
      .then(() => {
        self.skipWaiting();
      })
      .catch((err) => {
        console.log('add all error ', err);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhiteList.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// intercept network request
self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted for ', event.request.url);

  // Create a custom response
  event.respondWith(
    // check cache if requested resource exists
    caches
      .match(event.request)
      .then((cachedResponse) => {
        // respond with found resource
        if (cachedResponse) {
          console.log('Found ', event.request.url, ' in cache');
          return cachedResponse;
        }
        console.log('Network request for ', event.request.url);
        // else, validate that resource exists on the server
        return fetch(event.request).then((response) => {
          // if (response.status === 404) {
          //   // respons with custom 404 page
          //   return caches.match('pages/404.html');
          // }
          // cache response from network
          return caches.open(staticCacheName).then((cache) => {
            cache.put(event.request.url, response.clone());
            return response;
          });
        });
      })
      .catch((error) => {
        // TODO 6 - Respond with custom offline page
        console.log(error);
        // return caches.match('pages/offline.html');
      })
  );
});
