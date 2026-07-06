self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  const fallback = {
    title: "챙겨펫",
    body: "챙겨야 할 일정이 있어요.",
    url: "/",
  };

  let payload = fallback;

  if (event.data) {
    try {
      payload = { ...fallback, ...event.data.json() };
    } catch {
      payload = { ...fallback, body: event.data.text() };
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      data: {
        url: payload.url,
      },
      tag: payload.tag || "chaenggyeo-pet-reminder",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients
      .matchAll({ includeUncontrolled: true, type: "window" })
      .then((clients) => {
        const existingClient = clients.find((client) =>
          client.url.endsWith(targetUrl),
        );

        if (existingClient) {
          return existingClient.focus();
        }

        return self.clients.openWindow(targetUrl);
      }),
  );
});
