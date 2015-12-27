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
    $.ajax({
      url: "https://android.googleapis.com/gcm/send/",
      type : "POST",
      dataType : "json",
      header: "Access-Control-Allow-Origin: *",
      header : "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin, Access-Control-Allow-Headers",
      contentType : "application/json",
      authorization : "key=AIzaSyC3ulUzHUwB2E1kbs-o9iOhMtz2a-DnLDQ",
      data :(sub.endpoint.split("https://android.googleapis.com/gcm/send/"))[1],
      timeout : 1000000,
      crossDomain : true,
      cache : false,
      async : true,

      beforeSend: function (xhr) {
        xhr.setRequestHeader ("Authorization", "key=AIzaSyC3ulUzHUwB2E1kbs-o9iOhMtz2a-DnLDQ");
      },

      success : function(response, e ,xhr){
        console.log("success.....",response);

      },

      error : function(jqXHR, textStatus, errorThrown){
        console.log("error....",errorThrown);

      },

      complete : function(response, e ,xhr){

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
