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
    var endPoint = (sub.endpoint.split("https://android.googleapis.com/gcm/send/"))[1];
    console.log("endPoint.....", endPoint);
    $.ajax({
      url: "https://android.googleapis.com/gcm/send",
      type : "POST",
      dataType : "json",
      contentType : "application/json",
      header: "Access-Control-Allow-Origin:*",
      Authorization:"key=AIzaSyC3ulUzHUwB2E1kbs-o9iOhMtz2a-DnLDQ",
      data : JSON.stringify({
        "registration_ids" : ["eu92dB_ifQw:APA91bHVbA3kVKep8g3n3_qToELCnwfmYKTzRB2QrHikncx_qN3lribiww4SZOJpzwBM6ti8TIpVaZIqPMKd5wH4VQCP3cagw-YXtHNM-Bx9wiyPoD_Ds720VmK5S9XqItqSrejp2IyQ"]
    }),
      success : function(response, e ,xhr){
      console.log("success.....",response);
      }
    });
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
