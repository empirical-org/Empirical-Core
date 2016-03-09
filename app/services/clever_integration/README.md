If you only read one sentence in this README, may it be the following :
District tokens are the only meaningful auth tokens in Clever - Clever may send you a token for a student, or a token for a teacher, but these tokens do not give access to those users' classrooms or classroom rosters.

Clever is a login service for schools - people can create a username and password on clever and then use that account to log in to a host of education apps. Our integration with Clever enables this - it enables teachers and students to sign in to Quill using their clever accounts, and to download classroom-related data that already exists on Clever.

The code related for this feature exists
  * in the current directory
  * in app/controllers/auth/clever.rb
  * in config/omniauth.rb
  * and in environment variables, specified in .env in development and in heroku configs on heroku deployments

We do not distinguish on our end between a clever sign up and a clever log in, we perform the same actions in either case (as you can see by looking in app/controllers/auth/clever.rb). From here forward when we refer to 'sign up' for brevity, but what is said about sign up applies equally to log in.

There are three types of Clever users, and each involves a different sign up process on our end.
When a district user signs up, all we do is create a district record in our database containing its name, clever_id, and token.
This process is simple, but is necessary for any of the other sign ups to fully work (since the district token is needed for gaining access to classroom data).

When a teacher signs up, if its district has not signed up previously, we abort the sign up process (since theres no point - we wont be able to get the classroom data). If its distrct has signed up, we use that district token to request the teachers classrooms, and those classrooms' rosters, from clever, and store records of them in our db. All of this activity makes the teacher sign up process by far the most complicated.

Since the teacher sign up process involves downloading all of that teacher's students, the student sign up process is very simple - we simply retrieve the record that we already created when that students teacher signed up. This implies that a teacher must sign up before one of the students tries to sign up. This could technically be changed, though it is probably unlikely that a student will sign up to quill before that student's teacher has signed up (and not much utility to doing so, since there will be no assigned activities to complete).

These tasks are split into aspects, with associated files or sub-directories -
  1. top-level sign up logic (in ./sign_up folder)
  2. top-level data-importing logic (in ./importers folder)
    importing can then be further broken down into 4 main aspects
    1. requesting data from Clever (functions are isolated in the file ./requesters.rb, and are injected by sign_up/main.rb into sign_up/sub_main.rb)
    2. parsing the response to the requests (handled in the folder ./parsers)
    3. creating records in our database based on the responses (handled in the folder ./creators)
    4. associating the records we create with each other in the appropriate way (handled in the folder ./associators)