$(function() {
  if (!$('.activity-data').length) {
    return;
  }

  let $form = $('.activity-form form')
    , saved = false;

  let iframeSrc = $('iframe').prop('src');
  window.quill = new Quill(iframeSrc, {
    afterIframeActivitySaved: function () {
      saved = true;
      window.location = $form.data('redirect')
    }
  });

  $form.on('submit', function (e) {
    if (saved) return true;
    e.preventDefault();
    quill.sendMessage('savingActivity');
  });

  quill.listen();
});