# Referral Program

Quill.org has a referral program that allows teachers to refer other teachers
to the website and then receive various perks and goodies for doing so.

Our referral program feature is built on top of middleware (located in
`app/middleware/affiliate_middleware.rb`) that looks for a query string
(`?champion=teachers-referral-code-here`) and then saves the value from that
query string as a cookie.

When a new teacher signs up, we check for the existence of that referral
cookie, and then record a referral in the database.

This feature relies on two models:

## ReferrerUser (table: referrer_users)

The ReferrerUser table is where we keep track of each teacher's affiliate ID.
To populate this table for current users, we ran a rake task called
`referrers:generate_codes`.

When a new teacher account is created, a callback on the User model called
`generate_referrer_id` is triggered, which (as the name might suggest)
generates a referral code and adds it to the ReferrerUser table.

The table has two relevant columns: `user_id` and `referral_code`.

## ReferralsUser (table: referrals_users)

The ReferralsUser model keeps track of who new users were referred by. When a
new teacher joins, their ID will be added to this table's `referred_user_id`
column along with the referring user's ID in the `user_id` column.

The other relevant column in this table is the `activated` column. This column
tells us whether the referral in question should be counted toward the referring
user's count of referrals. This is because we don't want to count a user as a
referral just for signing up. Instead, once an activation condition is met, we
update the `activated` column to `true`, which triggers a variety of callbacks.
