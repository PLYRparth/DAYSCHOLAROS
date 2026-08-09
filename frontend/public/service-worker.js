self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'DayScholar OS';
  const options = {
    body: data.body || 'You have a new notification.',
    icon: '/vite.svg', // Fallback icon
    badge: '/vite.svg'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Navigate the user to the app when they click the notification
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Focus existing window if available
      for (let client of windowClients) {
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
