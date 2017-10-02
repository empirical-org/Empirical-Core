import $ from 'jquery';
export default function (priceInCents, description) {
  const amount = priceInCents;
  const handler = StripeCheckout.configure({
    key: stripePubKey,
    image: 'https://d1yxac6hjodhgc.cloudfront.net/wp-content/uploads/2015/11/Quill-Icon.svg',
    locale: 'auto',
    token(token) {
      $.post('charges.json',
          { authenticity_token: $('meta[name=csrf-token]').attr('content'), source: token, card: token.card, amount, })
          .done((data) => {
            if (data.err) {
              // there is an error for this in the charges controller,
              // but better error is passing weirdness back
              const initialMessage = data.err.message ? data.err.message : 'Please ensure you are providing the same email used to login to Quill, and try again';
              alert(`Your card was not charged. ${initialMessage}. If the issue persists, please contact ryan@quill.org for help.`);
            } else if (data.message) {
              alert(data.message);
            } else if (amount === 45000) {
              alert('Premium has been activated for your account, and the accounts of any other teachers registered with your school on Quill. We will send a follow up email shortly.');
            }
            window.location.assign('/profile');
          });
    },
  });

    // $('#purchase-btn').on('click', function(e) {
    // // Open Checkout with further options
  handler.open({
    name: 'Quill Premium',
    description,
    amount,
  });

    // Close Checkout on page navigation
  $(window).on('popstate', () => {
    handler.close();
  });
}
