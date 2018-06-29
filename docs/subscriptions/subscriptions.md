# Subscriptions

There are three subscription tables:

1. Subscriptions - Contains the metadata about a subscription
2. School Subscriptions - Joins the school and a subscription
3. User Subscriptions - Joins a specific user to a subscription

![](/docs/subscriptions.svg)
https://www.lucidchart.com/invitations/accept/64e36df6-dd25-4085-b5af-047228db9e23


## School vs. User Subscriptions

A user can have a subscription in two ways. The first is that it is simply their own subscription, e.g. a trial, or a purchase of teacher premium. The second way is by getting it through their school. In both cases, the user has their own user subscription, but in the latter, it joins them with a subscription that is also joined with a school.

### User Subscriptions Through School
When a school subscription is created, there is an after commit callback that checks each of the schools users to determine whether they should be upgraded. This check occurs in `#updated_school` in `models/concerns/teacher.rb`. In short, if a teacher already has their own subscription, and then joins a school, or their school upgrades to premium, the teacher keeps the subscription with the more distant expiration date. If a teacher changes schools and had a subscription from their old school, they lose it no matter what.

## Ways a Subscription is Created
A subscription can be created from:
1. A user starting a trial (only if they've never had a subscription.)
2. A user purchasing an individual Teacher Premium account through Stripe.
3. A user purchasing an individual Teacher Premium account through PO, in which case someone from the sales team upgrades them through the CMS dashboard.
6. A user purchases with Stripe and has recurring checked -- in this case, a new subscription will begin each year and the purchaser will be billed.
4. A school purchasing a School Premium account through Stripe, in which case all teachers in the school are upgraded (if they pass the upgrade check as mentioned in Users Subscriptions Through School Section).
5. A school purchases a School Premium Account through PO, and the sales team upgrades the school through the CMS, which in term upgrades all teachers.
6. A school purchases with Stripe and has recurring checked -- in this case, a new subscription will begin each year and the purchaser will be billed.
