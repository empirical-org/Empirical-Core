

var handler = StripeCheckout.configure({
    key: 'pk_test_1DcdMAZJOFtEhqyV496DUvZs',
    image: 'https://s3.amazonaws.com/stripe-uploads/acct_15nIVJBuKMgoObiumerchant-icon-1430275622876-quill_logo_icon.png',
    locale: 'auto',
    token: function(token) {
      // Use the token to create the charge with a server-side script.
      // You can access the token ID with `token.id`
    }
  });

  $('.empty-blue').on('click', function(e) {
    // Open Checkout with further options
    handler.open({
      name: 'Quill',
      description: '2 widgets',
      amount: 2000
    });
    e.preventDefault();
  });

  // Close Checkout on page navigation
  $(window).on('popstate', function() {
    handler.close();
  });
