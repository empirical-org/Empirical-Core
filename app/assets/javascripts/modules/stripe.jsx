
EC.modules.Stripe = function () {
    var handler = StripeCheckout.configure({
    key: 'pk_test_6pRNASCoBOKtIshFeQd4XMUh',
    image: 'https://d1yxac6hjodhgc.cloudfront.net/wp-content/uploads/2015/11/Quill-Icon.svg',
    locale: 'auto',
    token: function(token) {

        // Use the token to create the charge with a server-side script.
        // You can access the token ID with `token.id`
          $.post('/charges', {authenticity_token: $('meta[name=csrf-token]').attr('content'), source: token.id});
    }
    });

    // $('#purchase-btn').on('click', function(e) {
    // // Open Checkout with further options

    handler.open({
      name: 'Quill Premium',
      description: '$80 Teacher Premium',
      amount: 8000
    });
    // e.preventDefault();
    // });

    // Close Checkout on page navigation
    $(window).on('popstate', function() {
    handler.close();
    });

  };
