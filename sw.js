/* Generated at build time. Each deployment folder owns its own cache. */
const BASE = new URL("./", self.location.href);
const PREFIX = `meteonl-${encodeURIComponent(BASE.pathname)}-`;
const CACHE = PREFIX + "dfe657f70f2f";
const ASSETS = ["assets/index-D8m_sYTE.css","assets/index-DwF02MZs.js","icon-192.png","icon-512.png","icon.svg","index.html","manifest.webmanifest","shortcuts/MeteoNL Luz.shortcut","weather-backgrounds/cold.webp","weather-backgrounds/fog.webp","weather-backgrounds/night.webp","weather-backgrounds/rain.webp","weather-backgrounds/storm.webp","weather-backgrounds/sunny.webp","weather-backgrounds/sunset.webp"].map((path) => new URL(path, BASE).href);
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key !== CACHE &&
                (key.startsWith(PREFIX) ||
                  (BASE.pathname === "/" && key.startsWith("weather-clock-"))),
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (
    request.method !== "GET" ||
    url.origin !== BASE.origin ||
    !url.pathname.startsWith(BASE.pathname)
  )
    return;
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(new URL("index.html", BASE).href, { ignoreVary: true }),
      ),
    );
    return;
  }
  const resource = url.origin + url.pathname;
  if (ASSETS.includes(resource)) {
    event.respondWith(
      caches
        .match(resource, { ignoreVary: true })
        .then((cached) => cached || fetch(request)),
    );
  }
});
