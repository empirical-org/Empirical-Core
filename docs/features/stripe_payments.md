# Stripe Payments

Stripe is used for processing credit card payments.

## Charges Controller

The charges controller is where most credit card / purchasing actions are routed.

### enter_or_update_card.js

This JS file brings up a Stripe Modal where users can enter / update the credit card we keep on file. It takes two arguments -- a callback and 'Enter' or 'Update' as string values depending on whether a user is entering a credit card for the first time, or updating the payment they have on file.

#### `ChargesController#create_customer_with_card`

If 'Enter' is passed, then the Stripe modal will pass the customer's details to `#create_customer_with_card`

This action will create a customer in Stripe and associate the current user with that Stripe record by updating their `stripe_customer_id`. In Stripe, the default payment source is the credit card they just entered (unless they update it).


If 'Update' is passed, then the Stripe modal will pass the customer's new credit card to `ChargesController#create_customer_with_card`

###
