// coi-serviceworker.js
// GitHub Pages のようにヘッダをいじれない環境で
// COOP/COEP を後付けして SharedArrayBuffer を有効化する Service Worker

self.addEventListener('install', (event) => {
  // すぐ有効になってほしいので
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // 通常の fetch をベースに、レスポンスヘッダだけ差し替える
  event.respondWith((async () => {
    const res = await fetch(req);

    // 一部の特殊レスポンスは素通しする（ブラウザ内部用など）
    if (res.status === 0) {
      return res;
    }

    const newHeaders = new Headers(res.headers);
    newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
    newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders
    });
  })());
});
