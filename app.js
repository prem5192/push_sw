var reg;
var sub;
var isSubscribed = false;
var subscribeButton = document.querySelector('button');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/push_sw/sw.js').then(function() {
    return navigator.serviceWorker.ready;
  }).then(function(Registration) {
    reg = Registration;
    subscribeButton.disabled = false;
    console.log('Service Worker is ready :', reg);
  }).catch(function(error) {
    console.log('Service Worker Error :', error);
  });
}

subscribeButton.addEventListener('click', function() {
  if (isSubscribed) {
    unsubscribe();
  } else {
    subscribe();
  }
});

function subscribe() {
  reg.pushManager.subscribe({userVisibleOnly: true}).
  then(function(pushSubscription) {
    console.log("push subscription............", pushSubscription)
    sub = pushSubscription;
    console.log('Subscribed! Endpoint:', sub.endpoint);
    var register_Id = (sub.endpoint.split("https://android.googleapis.com/gcm/send/"))[1];
    console.log("register_Id.....", register_Id);
    subscribeButton.textContent = 'Unsubscribe';
    isSubscribed = true;
  });
}

function unsubscribe() {
  sub.unsubscribe().then(function(event) {
    subscribeButton.textContent = 'Subscribe';
    console.log('Unsubscribed!', event);
    isSubscribed = false;
  }).catch(function(error) {
    console.log('Error unsubscribing', error);
    subscribeButton.textContent = 'Subscribe';
  });
}
