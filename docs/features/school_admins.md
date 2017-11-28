# School Admins

## ADMIN IS NOT A ROLE

Admin is not a role! Rather, it a relationship that can belong to any user (but currently only applies to teachers). An admin is someone whose `user_id` is listed in the schools_admins table. A single user can be an admin of none, one, or many schools. A school may have none, one, or many admins.


## Admin Capabilities

An admin can log into the accounts of teachers that are part of their schools. This currently happens through the same mechanism that allows a staff member can log into any account. However, this feature should ultimately be deprecated, and instead we will allow admins to only view reports of their teachers.

Admins can also invite teachers to sign up for Quill and automatically join their school, at which point the user becomes one of the admins teachers.

When a user is the admin of a school, the navbar on their profile page will have a 'School Dashboard' tab. From here, they can see an overview of their teachers, and access their accounts/premium reports.
