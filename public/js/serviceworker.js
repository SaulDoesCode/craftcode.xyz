this.addEventListener('install', event => event.waitUntil(caches.open('v1').then(cache => cache.addAll(['/js/Crafter.js', '/js/polyfills.min.js']))));

this.addEventListener('fetch', event => {
  var response;
  event.respondWith(caches.match(event.request).then(res => {
    if(res) return res;
  }).catch(() => fetch(event.request)).then(r => {
    response = r;
    caches.open('v1').then(cache => cache.put(event.request, response));
    return response.clone();
  }).catch(() => caches.match('/sw-test/gallery/myLittleVader.jpg')));
});
