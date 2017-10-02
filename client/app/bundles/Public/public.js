import ClientRegistration from './startup/clientRegistration';

// for news page
$(document).ready(() => {
  $('iframe').ready(() => {
    if ($('script[src="https://static.medium.com/embed.js"]').length > 0) {
      setTimeout(() => {
        $('.spinner-container').hide();
      }, 2000);
    }
  });
});
