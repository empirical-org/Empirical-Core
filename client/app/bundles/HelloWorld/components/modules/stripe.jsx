import $ from 'jquery'
export default function (priceInCents, description) {
    var amount = priceInCents;
    var handler = StripeCheckout.configure({
    key: stripePubKey,
    image: 'https://d1yxac6hjodhgc.cloudfront.net/wp-content/uploads/2015/11/Quill-Icon.svg',
    locale: 'auto',
    token: function(token) {
          $.post('charges.json',
          {authenticity_token: $('meta[name=csrf-token]').attr('content'), source: token, card: token.card, amount: amount})
          .done(function( data ) {
            if (amount === 45000)  {
              alert('Premium has been activated for your account. You will receive follow-up communication within a business day.')
            }
            window.location.assign('/profile');
          });
    }
    });

    // $('#purchase-btn').on('click', function(e) {
    // // Open Checkout with further options
    handler.open({
      name: 'Quill Premium',
      description: description,
      amount: amount,
    });

    // Close Checkout on page navigation
    $(window).on('popstate', function() {
    handler.close();
    });

  }
