# Clever Integration
## Introduction
Clever is a login service for schools - people can create a username and password on clever and then use that account to log in to a host of education apps. Our integration with Clever enables this - it enables teachers and students to sign in to Quill using their clever accounts, and to download classroom-related data that already exists on Clever.

## Overview
Most of the relevant code related for this feature exists in:
  * [auth controller](https://github.com/empirical-org/Empirical-Core/blob/develop/services/QuillLMS/app/controllers/auth/clever_controller.rb)
  * [service objects](https://github.com/empirical-org/Empirical-Core/tree/develop/services/QuillLMS/app/services/clever_integration)
  * [background jobs](https://github.com/empirical-org/Empirical-Core/tree/develop/services/QuillLMS/app/workers/clever_integration)
  * [tableless models](https://github.com/empirical-org/Empirical-Core/tree/develop/services/QuillLMS/app/models/clever_integration)
  * [controller used as endpoints with React frontend](https://github.com/empirical-org/Empirical-Core/blob/develop/services/QuillLMS/app/controllers/clever_integration/teachers_controller.rb)
  * [Clever API configuration values](https://github.com/empirical-org/Empirical-Core/blob/develop/services/QuillLMS/config/initializers/clever.rb)
  * [omniauth configuration](https://github.com/empirical-org/Empirical-Core/blob/develop/services/QuillLMS/config/initializers/omniauth.rb#L31)
  * `.env` in development and in heroku configs for production

The backend does not distinguish between clever sign up and a clever log in, [CleverIntegration::SignUp::Main](https://github.com/empirical-org/Empirical-Core/blob/develop/services/QuillLMS/app/controllers/auth/clever_controller.rb#L5) entry point. From here forward when we refer to 'sign up' for brevity, but what is said about sign up applies equally to log in.  At this point an `auth_hash` object that we get via `OmniAuth` that is passed to one of [four](https://github.com/empirical-org/Empirical-Core/blob/develop/services/QuillLMS/app/services/clever_integration/sign_up/sub_main.rb#L9) user types paths: District Admin, School Admin, Student and Teacher.

### District Admin
When a district user signs up, all we do is create a district record in our database containing its name, clever_id, and token. This process is simple, but is necessary for any of the other *district integration* sign ups to fully work (since the district token is needed for gaining access to classroom data).


### Teacher

When a teacher signs up, [teacher_integration](https://github.com/empirical-org/Empirical-Core/blob/develop/services/QuillLMS/app/services/clever_integration/teacher_integration.rb#L17) runs the following:
1. Import the teacher: import here means either create or update the teacher in our database
1. Run the teacher integration: depending on the whether `auth_hash['info']['district']` exists perform either the district integration or library integration for that teacher . There is an example of each structure [here](https://github.com/empirical-org/Empirical-Core/blob/develop/services/QuillLMS/spec/support/shared_contexts/clever_teacher_auth_hash.rb)
1. Hydrate the teacher's classrooms cache: the auth_hash contains a listing of all the teachers classrooms.  Store this information about each classroom for later use
1. Update existing classrooms: using information from the cache, update db records for those classrooms already imported and ignore new ones.

#### District Integration vs. Library Integration
District integration and Library integrations have different client APIs for pulling teacher/classrooms/student data. District integrations allow us to associate a teacher's classrooms to a school and also the large district system.  Library integrations on the other hand are kind of isolated classrooms with no visibility to other connection to other classrooms.  Compare the `run` method in [district_teacher_integration](https://github.com/empirical-org/Empirical-Core/blob/develop/services/QuillLMS/app/services/clever_integration/district_teacher_integration.rb#L17) with [library_teacher_integration](https://github.com/empirical-org/Empirical-Core/blob/develop/services/QuillLMS/app/services/clever_integration/library_teacher_integration.rb).  Both of these integrations save the teacher's auth_credential so that importing can be performed later.

NB: The payloads from the district and client apis are different, but adapters are used to unify them for importing later.

#### Teacher Classroom Importing
After signup, teachers are able to selectively import new classes (and their corresponding students) via the UI which sends call to the backend endpoints in[CleverIntegration::TeachersController](https://github.com/empirical-org/Empirical-Core/blob/develop/services/QuillLMS/app/controllers/clever_integration/teachers_controller.rb)

### Student

Since the teacher sign up process involves downloading all of that teacher's students, the student sign up process is very simple - we simply retrieve the record that we already created when that students teacher signed up. This implies that a teacher must sign up before one of the students tries to sign up. This could technically be changed, though it is probably unlikely that a student will sign up to quill before that student's teacher has signed up (and not much utility to doing so, since there will be no assigned activities to complete).

## Legacy code

Currently, district_admin, school_admin and students still use an aspect pattern where the tasks are split into aspects, with associated files or sub-directories -
  1. top-level sign up logic (in ./sign_up folder)
  2. top-level data-importing logic (in ./importers folder)
    importing can then be further broken down into 4 main aspects
    a. requesting data from Clever (functions are isolated in the file ./requesters.rb, and are injected by sign_up/main.rb into sign_up/sub_main.rb)
    b. parsing the response to the requests (handled in the folder ./parsers)
    c. creating records in our database based on the responses (handled in the folder ./creators)
    d. associating the records we create with each other in the appropriate way (handled in the folder ./associators)


### TODO: Refactor the remaining legacy code into service objects with testing
