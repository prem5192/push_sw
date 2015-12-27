self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/push_sw/jquery-2.1.4.min.js'
      ]);
    })
  );
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
