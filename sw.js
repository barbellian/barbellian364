
const CACHE_NAME = "barbellian364-v2";
const CACHE_PREFIX = "barbellian364-";

const FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

// 새 버전 설치
self.addEventListener("install", event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(FILES);
      await self.skipWaiting();
    })()
  );
});

// 이전 버전 캐시 정리 및 새 버전 활성화
self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter(key =>
            key.startsWith(CACHE_PREFIX) &&
            key !== CACHE_NAME
          )
          .map(key => caches.delete(key))
      );

      await self.clients.claim();
    })()
  );
});

// 페이지는 네트워크 우선, 기타 파일은 캐시 우선
self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);

          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put("./index.html", response.clone());
          }

          return response;
        } catch (error) {
          return (
            await caches.match(request) ||
            await caches.match("./index.html")
          );
        }
      })()
    );

    return;
  }

  event.respondWith(
    (async () => {
      const cached = await caches.match(request);

      const networkUpdate = fetch(request)
        .then(async response => {
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
          }

          return response;
        });

      if (cached) {
        event.waitUntil(networkUpdate.catch(() => {}));
        return cached;
      }

      try {
        return await networkUpdate;
      } catch (error) {
        return new Response("오프라인 상태입니다.", {
          status: 503,
          headers: {
            "Content-Type": "text/plain; charset=utf-8"
          }
        });
      }
    })()
  );
});
