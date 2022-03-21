const FILES_TO_CACHE = [
    '/',
    './index.html',
     './favicon.ico',
   './manifest.json',
     './assets/css/style.css',
     './assets/js/loadImages.js',
     './assets/images/icons/icon-72x72.png',
    './assets/images/icons/icon-96x96.png',
    './assets/images/icons/icon-128x128.png',
     './assets/images/icons/icon-144x144.png',
  ];

  const CACHE_NAME = "static-cache-v2";
  const DATA_CACHE_NAME =  "data-cache-v1"

  //install
let e = Event
  self.addEventListener("install", function (e) {
      e.waitUntil(
          caches.open(CACHE_NAME).then(cache => {
              console.log("files were pre-cached successfully");
              return cache.addAll(FILES_TO_CACHE)
          })
      )
      self.skipWaiting()
  })

  //activate
  self.addEventListener("activate", function (e) {
      e.waitUntil(
          caches.keys().then(keyList => {
              return Promise.all(
                  keyList.map(key => {
                      if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                          console.log("files were acticated-removing old cache data.", key)
                          return caches.delete(key)
                      }
                  })
              )
          })
      )
      self.clients.claim() 
  })

  self.addEventListener('fetch',  (e) => {
      console.log('fetch request:' + e.request.url)
      e.respondWith(
          caches.match(e.request).then(function(request) {
              if (request) {
                  console.log('responding with cache : ' + e.request.url)
                  return request
              } else {
                  console.log('file no cached, fetching : ' + e.request.url)
                  return fetch(e.request)
              }
          })
      )
  })

  /* e.respondWith(
      fetch(e.request).catch(function() {
          return caches.match(e.request).then(function (response) {
              if (response) {
                  return response;
              } else if (e.request.headers.get("accept").includes("text/html"))
              {
                  return caches.match("/")
              }
          })
      })
  )*/