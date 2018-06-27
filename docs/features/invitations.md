# Invitations

The invitations table is the primary table for all invitations on Quill. Its purpose is to maintain a record of inviter and invitee that can then be joined upon by tables for any of a variety of specific types of invitations.

We maintain a record of the inviter’s ID, the invitee’s email address, and the type of invitation this represents.

Then, other tables representing specific types of invitations reference this table using an invitation_id to invitations.id join.

This allows us to create multiple of a certain type of invitation while still maintaining a single source of truth with respect to the inviter and invitee.

The reason we use an email address to represent the invitee instead of an ID is because we don’t yet know if these users exist when the invitation is created. We can still easily join the users table on email address to find the user if they exist.
