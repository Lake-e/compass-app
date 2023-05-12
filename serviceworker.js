/*
Copyright 2021 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// Choose a cache name
const cacheName = 'cache-v1.2';
// List the files to precache
const precacheResources = ['/compass-app/', '/compass-app/index.html', '/compass-app/privacy.html', '/compass-app/compass-dial.jpeg', '/compass-app/resources/compass-app-icon.png'];

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
  console.log('Service worker install event!');
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activate event!');
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(
    // Try to fetch the requested resource from the network first
    fetch(event.request).then((response) => {
      // If the response is successful, clone it and put it in the cache for future use
      if (response.status === 200) {
        caches.open(cacheName).then((cache) => {
          cache.put(event.request, response.clone());
        });
      }
      // Return the response to the browser
      return response;
    }).catch(() => {
      // If the network request fails, try to respond with a precached resource
      return caches.match(event.request);
    }),
  );
});
