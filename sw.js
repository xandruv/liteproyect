// Service worker de LiteProyect: guarda la app en el dispositivo para que funcione sin conexión.
// Al publicar una versión nueva de la app, cambia VERSION para que los móviles la actualicen.
const VERSION = "liteproyect-v1";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./firebase-config.js",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-512.png"];
const CDN_HOSTS = ["www.gstatic.com", "fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("liteproyect-") && k !== VERSION && k !== VERSION + "-cdn").map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Archivos de la app: se sirven desde el dispositivo y se actualizan en segundo plano.
  if (url.origin === self.location.origin) {
    const key = req.mode === "navigate" ? "./index.html" : req;
    event.respondWith(caches.open(VERSION).then(async cache => {
      const cached = await cache.match(key, { ignoreSearch: req.mode === "navigate" });
      const network = fetch(req).then(res => {
        if (res && res.ok) cache.put(key, res.clone());
        return res;
      }).catch(() => cached || Response.error());
      return cached || network;
    }));
    return;
  }

  // Librerías de Firebase y tipografía: se guardan la primera vez y después se usan sin conexión.
  if (CDN_HOSTS.includes(url.hostname) && (url.hostname !== "www.gstatic.com" || url.pathname.startsWith("/firebasejs/"))) {
    event.respondWith(caches.open(VERSION + "-cdn").then(async cache => {
      const cached = await cache.match(req);
      if (cached) return cached;
      const res = await fetch(req);
      if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
      return res;
    }));
  }
  // Todo lo demás (Firestore, inicio de sesión de Google) va directamente a internet.
});
