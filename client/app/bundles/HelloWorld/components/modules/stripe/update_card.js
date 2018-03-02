import $ from 'jquery';

export default function (successCallback, closeCallback) {
  const handler = StripeCheckout.configure({
    key: stripePubKey,
    image: 'https://d1yxac6hjodhgc.cloudfront.net/wp-content/uploads/2015/11/Quill-Icon.svg',
    locale: 'auto',
    panelLabel: 'Update Card Details',
    allowRememberMe: false,
    email: document.getElementById('current-user-email').getAttribute('content'),
    token(token) {
      $.post('charges/update_card',
          { authenticity_token: $('meta[name=csrf-token]').attr('content'), source: token, card: token.card, })
          .done((data) => {
            if (data.err) {
              // there is an error for this in the charges controller,
              // but better error is passing weirdness back
              const initialMessage = data.err.message ? data.err.message : 'Please ensure you are providing the same email used to login to Quill, and try again';
              alert(`Your card was not changed. ${initialMessage}. If the issue persists, please contact ryan@quill.org for help.`);
            } else if (data.message) {
              alert(data.message);
            }
            successCallback(token.card.last4);
          });
    },
  });

  handler.open({
    name: 'Quill Premium',
    description: 'Enter/Update Your Credit Card',
  });

    // Close Checkout on page navigation
  $(window).on('popstate', () => {
    handler.close();
  });
}
