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
    if (data.id) {
      quill.iframe.activityFinished(data);
    } else {
      window.location = '/';
    }
  });
});
