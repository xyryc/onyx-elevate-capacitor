/* Onyx Streak Reminder — minimal service worker for web push */
self.addEventListener("install", (e) => {
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_) {}
  const title = data.title || "Don't break your streak 🔥";
  const body = data.body || "You haven't logged a workout today. Tap to keep your streak alive.";
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/app-icon-512.png",
      badge: "/app-icon-512.png",
      tag: data.tag || "onyx-streak",
      data: { url: data.url || "/my-library" },
    }),
  );
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/my-library";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ("focus" in c) return c.focus().then(() => c.navigate(target));
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    }),
  );
});
