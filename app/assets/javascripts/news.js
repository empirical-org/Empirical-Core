$(document).ready(function() {
  $("iframe").ready(function() {
    if ($('script[src="https://static.medium.com/embed.js"]').length > 0) {
      setTimeout(function() {
        $('.spinner-container').hide();
      }, 2000);
    }
  });
});
