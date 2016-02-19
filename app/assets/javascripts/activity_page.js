jQuery(function ($) {
  if (!$('.activity-show').length) {
    return;
  }

  var moduleUrl = $('iframe').prop('src');
  window.quill = new Quill(moduleUrl);
  quill.listen();
  var windowProxy = new Porthole.WindowProxy(moduleUrl, 'activity-iframe');
  windowProxy.addEventListener(function(message) {
    var data = message.data;
    if (data.action === "size_changed") {
      $("iframe").css("height", data.height);
    }
    else if (data.action === "activity_complete") {
      if (data.id) {
        quill.iframe.activityFinished(data);
      } else {
        window.location = '/';
      }
    }
    else {
      return;
    }
  });
});

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event)
{
  if (event.origin === "http://localhost:3000") {
    if (event.data.action === "message") {window.location.reload()};
  } else if (event.origin === "https://grammar.quill.org"){
    if (event.data.action === "message") {window.location.reload()};
  } else {
    return
  }
}


