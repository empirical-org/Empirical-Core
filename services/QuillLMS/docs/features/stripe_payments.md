# Stripe Payments

Stripe is used for processing credit card payments.

## Charges Controller

The charges controller is where most credit card / purchasing actions are routed.

### `#create_customer_with_card`

This action will create a Stripe customer via the Stripe API and associate the current user with that Stripe record by updating their `stripe_customer_id`. In Stripe, the default payment source is the credit card they just entered (unless they update it).

### `#update_card`

This changes the current users default card to whatever was passed to it from `params[:source][:id]`

### `#new_teacher_premium`

This calls `Subscription.give_teacher_premium_if_charge_succeeds` and returns the new subscription. It should only be used for users who have a Stripe customer id.

### `#new_school_premium`

This calls `Subscription.give_school_premium_if_charge_succeeds` and returns the new subscription. It should only be used for users who have a Stripe customer id.

## enter_or_update_card.js

This JS file brings up a Stripe Modal where users can enter / update the credit card we keep on file. It takes two arguments -- a callback and 'Enter' or 'Update' as string values depending on whether a user is entering a credit card for the first time, or updating the payment they have on file.

If 'Enter' is passed, then the Stripe modal will pass the customer's details to `ChargesController#create_customer_with_card`

If 'Update' is passed, then the Stripe modal will pass the customer's new credit card to `ChargesController#update_card`

## Stripe Customer's Last Four of Credit Card

We do not store this information on our own servers, however, we can access it through the Stripe API. The method to do so is `#user.last_four`

## Recurring Subscriptions

Stripe customers can be billed on a regular cycle. Visit the recurring subscription docs to learn more about this.
