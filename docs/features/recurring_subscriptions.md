# Recurring Subscriptions

There is a `recurring` column on the `Subscription` table. A boolean value represents what happens upon the expiration of a users subscription. If true, then a scheduled job will run a rake task attempting to rebill the user through Stripe, and if successfull, renew their subscription for an additional year.

## Scheduled Job

There is a scheduled job on Heroku that runs `rake update_todays_expired_recurring_subscriptions` once a day.

## Rake Task

`rake update_todays_expired_recurring_subscriptions` calls `Subscription.update_todays_expired_recurring_subscriptions`

## `Subscription.update_todays_expired_recurring_subscriptions`

This method gets all subscriptions where the expiration date is today and recurring is true. It then iterates through, calling `update_if_charge_succeeds` on each subscription instance.

## `#update_if_charge_succeeds`

Calls `#charge_user` and if the charge succeeds, the `#renew_subscription` is called.

## `#charge_user`

If the subscription has a purchaser and the purchaser has a Stripe customer id, the renewal_price of the subscription is calculated and billed to the purchaser through the Stripe API.

## `#renew_subscription`

Creates a new subscription by duping the last one.
