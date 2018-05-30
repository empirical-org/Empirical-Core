# Subscription

## Columns

#### expiration
This is the day that a subscription expires.

Type: Date

Example: 2016-09-01

#### account_type

This is a descriptor of the type of premium account they have. Please use strings from the array in Subscriptions::ALL_OFFICIAL_TYPES. There are other types that have been in use, but they should not be used in new subscriptions. Ultimately, this should be moved to its own database table.

Type: String

Example: Teacher Paid


#### purchaser_email
This is a human readable identifier of the purchaser so that the sales team does not need to go off of the user id, and so that they can add purchaser's emails if they are not in the system.

Type: String

Example: purchaser@quill.org

#### start_date
The day on which the subscription is activated. Before this date, it is not valid. The purpose of this is so that we can stack future subscriptions for users.

Type: Date

Example: 2015-09-01


#### subscription_type_id
This is not in use yet -- it will be used for the table we make for account_type.

Type: Foreign Key

#### purchaser_id
Foreign key pointing to the user who bought the subscription. If purchased through stripe this occurs automatically.

Type: Foreign Key

#### recurring
Whether or not the subscription is recurring. If true, then on the subscription's expiration date a cron job will charge the user and give them a new subscription ending a year later

Type: FalseClass

Example: false

Defaults To: nil


#### de_activated_date
The date a subscription was terminated. This would occur if a user had an individual subscription and then their school upgraded them. If a subscription has a de-activated date it is no longer valid.

Type: Date

#### payment_method
How the subscription was purchased. It should be listed in Subscriptions::PAYMENT_METHODS

Type: String

Example: ['Credit Card']

#### payment_amount
The value in cents that a user paid.

Example: 8000


## Relations

has_many => user_subscriptions

has_many => school_subscriptions

has_many => credit_transactions

has_many => users through user_subscriptions

has_many => schools through school_subscriptions

belongs_to => users

belongs_to => subscription_types => nil
