self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('push', function(event) {
  console.log('Push message', event);
  var title = 'Push message';

  event.waitUntil(
    self.registration.showNotification(title, {
      'body': 'Click to enter food zone.',
      'icon': 'images/food_zone.jpg'
    }));
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click: tag', event.notification.tag);
  event.notification.close();
  var url = 'https://prem5192.github.io/service_worker/index.html';
  return clients.openWindow(url);
});
