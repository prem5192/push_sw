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
     dataType: "json",
     contentType: "application/json",
     crossDomain:true,
    //header:"Access-Control-Allow-Origin:*",
     data : JSON.stringify({
        "registration_ids" : [endPoint]  
      }),
     beforeSend : function(req) { 
        req.setRequestHeader('Authorization', 'key=AIzaSyC3ulUzHUwB2E1kbs-o9iOhMtz2a-DnLDQ'); 
        req.setRequestHeader('Access-Control-Allow-Origin', '*'); 
        req.setRequestHeader('Access-Control-Request-Method', 'POST');
      },
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
