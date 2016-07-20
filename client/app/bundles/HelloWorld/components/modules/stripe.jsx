import $ from 'jquery'
export default function () {
    var amount = 8000;
    var handler = StripeCheckout.configure({
    key: stripePubKey,
    image: 'https://d1yxac6hjodhgc.cloudfront.net/wp-content/uploads/2015/11/Quill-Icon.svg',
    locale: 'auto',
    token: function(token) {
          $.post('charges.json',
          {authenticity_token: $('meta[name=csrf-token]').attr('content'), source: token, card: token.card, amount: amount})
          .done(function( data ) {
            window.location.assign(data.route);
          });
    }
    });

    // $('#purchase-btn').on('click', function(e) {
    // // Open Checkout with further options
    handler.open({
      name: 'Quill Premium',
      description: '$80 Teacher Premium',
      amount: amount,
    });

    // Close Checkout on page navigation
    $(window).on('popstate', function() {
    handler.close();
    });

  };
