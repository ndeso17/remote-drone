const CACHE = "rd-v1";
const precache = [
  "/",
  "/bootstrap/css/bootstrap.min.css",
  "/css/style.css",
  "/bootstrap/js/bootstrap.bundle.min.js",
  "/ionicons/dist/ionicons/ionicons.esm.js",
  "/ionicons/dist/index.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(precache)));
});

self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
