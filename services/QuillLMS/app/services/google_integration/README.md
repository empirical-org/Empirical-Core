# Google Integration

We currently use google integration for two things:

1. SSO : allowing users to sign up / log in with their google account (so they dont have to manually enter in their name and email, and they dont have to come up with a new password).
2. CLASSROOM : allowing teachers to import the classrooms and students they already created on google classroom, so they dont have to manually recreate them in Quill.

## Overview

Both of these integrations involve :
  * the code in this directory
  * the controllers in app/controllers/auth/google
  * configuration details specified in config/omniauth.rb
  * environment variables (specified in .env file in development, or in heroku config on a heroku deployment)

A good introduction to how this stuff works is this blog post - https://www.twilio.com/blog/2014/09/gmail-api-oauth-rails.html.

If you read that blog post, the code for SSO should be relatively straightforward.
All of the code for SSO within this directory is in ./client.rb and ./profile.rb

The code for CLASSROOM does more things and is more complicated. The code for CLASSROOM in this directory is in the sub-directory ./classroom.

If you look in app/controller/auth/google.rb, you'll notice that the CLASSROOM import feature is activated for every user that signs up through google (uses SSO to sign up with google).

## Classroom namespace

CLASSROOM performs a different task depending on whether the user signing up is a student or a teacher.
If the user is a student, the feature requests the user's courses from google (classrooms are called courses in google classroom), and checks to see if we have in the past created a classroom for one of those courses in our db. We know if a classroom in our db was created for a google course by its google_classroom_id field.
If such a classroom exists in our db, we connect the student to that classroom. That's it for CLASSROOM student sign up.
CLASSROOM will not create classrooms records in our db for courses pertaining to the student if they do not already exist.

When a user signs up, signs in, or re-syncs their google classroom, records are created in our db to match records of courses in google. In this case, any student records on google that are associated to those google courses are also downloaded and recorded in our db (we import courses and their rosters).

The general process by which the CLASSROOM feature performs these tasks can be sliced into three phases -
1. requesting information from Google
2. parsing the responses to those requests
3. importing (i.e. creating or updating) records in our database using those parsed responses.

### TODO: Remove legacy code aspect pattern involving aspects and move to a more service object based approach for better transparency and testingj
