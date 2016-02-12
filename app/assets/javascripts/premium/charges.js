var handler = StripeCheckout.configure({
key: 'pk_test_6pRNASCoBOKtIshFeQd4XMUh',
locale: 'auto',
token: function(token) {
  // Use the token to create the charge with a server-side script.
  // You can access the token ID with `token.id`
}
});

$('#purchase-btn').on('click', function(e) {
// Open Checkout with further options
handler.open({
  name: 'Stripe.com',
  description: '2 widgets',
  amount: 2000
});
e.preventDefault();
});

// Close Checkout on page navigation
$(window).on('popstate', function() {
handler.close();
});
