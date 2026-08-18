const CACHE_NAME = 'me4261-cache-v3';

const ASSETS = [
  './',
  './index.html',
  './login.html',
  './faculty_login.html',
  './SDB.html',
  './faculty.html',
  './results.html',
  './feedback.html',
  './mocktest.html',
  './test.html',
  './config.js',
  './manifest.json',
  './offline.html',
  './icon-192.png',
  './icon-512.png'
];


/* ================================
   INSTALL
================================ */

self.addEventListener('install', (event) => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then((cache) => {

        return cache.addAll(ASSETS);

      })

  );

  self.skipWaiting();

});


/* ================================
   ACTIVATE
================================ */

self.addEventListener('activate', (event) => {

  event.waitUntil(

    caches.keys().then((keys) => {

      return Promise.all(

        keys.map((key) => {

          if (key !== CACHE_NAME) {

            return caches.delete(key);

          }

        })

      );

    })

  );

  self.clients.claim();

});


/* ================================
   FETCH
================================ */

self.addEventListener('fetch', (event) => {

  const request = event.request;

  const url = new URL(request.url);


  /*
     IMPORTANT:

     Always get the latest MockTest.html
     from the network.

     This prevents old mobile cache
     from showing the previous version.
  */

  if (
    url.pathname.endsWith('/mocktest.html')
  ) {

    event.respondWith(

      fetch(request)
        .then((response) => {

          return response;

        })
        .catch(() => {

          return caches.match(request);

        })

    );

    return;

  }


  /*
     GitHub-hosted mock-test images
     
     Do not cache them through this
     Vercel service worker.
  */

  if (
    url.hostname ===
    'me4127-2026.github.io'
  ) {

    event.respondWith(

      fetch(request)
        .catch(() => {

          return caches.match(request);

        })

    );

    return;

  }


  /*
     Other website files:
     
     Cache first, then network.
  */

  event.respondWith(

    caches.match(request)

      .then((response) => {

        return response || fetch(request);

      })

      .catch(() => {

        return caches.match(
          './offline.html'
        );

      })

  );

});
