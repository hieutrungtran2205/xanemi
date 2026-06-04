// Minimal service worker — its sole job is to exist so the app is installable.
// No fetch handler: requests use the browser default (network), so we don't
// intercept just to pass through.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
