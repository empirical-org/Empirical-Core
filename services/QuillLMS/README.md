## Documentation Table of Contents

* [API Controllers](https://github.com/empirical-org/Empirical-Core/blob/develop/app/controllers/api/README.md)
* [Authentication Controllers](https://github.com/empirical-org/Empirical-Core/blob/develop/app/controllers/auth/README.md)
* [Clever Integration](https://github.com/empirical-org/Empirical-Core/blob/develop/app/services/clever_integration/README.md)
* [CMS controllers](https://github.com/empirical-org/Empirical-Core/blob/develop/app/controllers/cms/README.md)
* [Google Integration](https://github.com/empirical-org/Empirical-Core/blob/develop/app/services/google_integration/README.md)

# Welcome to QuillLMS

QuillLMS is the Learning Management System that powers Quill.org, a free writing tool. QuillLMS is part of Empirical-Core, our web app for managing students, assigning activities, and viewing results

**Fork and Clone this repository to submit a Pull Request**

## Install QuillLMS

### MacOS Install Instructions
In your terminal:
1. Clone the Empirical Core repo `git clone https://github.com/empirical-org/Empirical-Core.git`
2. Navigate to LMS directory: `cd services/QuillLMS`
3. (recommended) Install the version of [Postgres.app](https://postgresapp.com/) that supports all postgres versions.
    - install the binary
    - create a postgresql v10 server through the Postgres.app GUI and start it
4. Run install script: `sh bin/dev/bootstrap.sh`
5. Open your browser to [localhost:3000](http://localhost:3000), the app should be running.

### Manual Install Instructions

QuillLMS is the Learning Management System that powers Quill.org. It is part of Empirical-Core Here's how to get QuillLMS running on your system:

1. Download and install [rbenv](https://github.com/sstephenson/rbenv) (or another Ruby version manager of your choice). You need to have Ruby version 2.5.1 installed in order to use Empirical Core. The best way to make sure you have version 2.5.1 is to follow the README and wiki of the Ruby version manager that you download.

    If you decide to use rbenv, then [homebrew](http://brew.sh/) has a really great and easy-to-use setup and install process:

    1. `brew update`
    2. `brew install rbenv ruby-build`
    3. `echo 'eval "$(rbenv init -)"' >> ~/.bash_profile`
    4. Close and reopen your terminal.


2. Download and install [postgres](http://www.postgresql.org/) version 10.5, the database engine Empirical Core uses. The easiest way to get started with this is to download [postgres.app](http://postgresapp.com/).

    If you're more comfortable with installing custom software, you can use [homebrew](http://brew.sh/) to download and install postgres instead using the following commands:

    1. `brew update`
    2. `brew install postgres`
    3. Follow the instructions on the resulting info screen.


3. Install Redis. You can [download it directly](http://redis.io/download).

    Alternatively, you can use [homebrew](http://brew.sh/) to install it by running `brew install redis`.


4. Navigate to the directory where you'd like Empirical Core to live, then run the following command to clone the Empirical Core project repository:

    `git clone https://github.com/empirical-org/Empirical-Core.git`


5. Use `cd Empirical-Core/services/QuillLMS` to change directory into the QuillLMS service.

6. Install bundler with `gem install bundler`.

7. Install the bundle with `bundle install`.

8. Install node via [nvm](https://github.com/creationix/nvm#installation). Run `nvm install` to install the version of node used by this app.

9. Install npm by running `brew install npm`.

10. Install node modules by running `npm install`.

11. Run `bundle exec rake empirical:setup` to automagically get all of your dependencies and databases configured.

12. Switch into the client directory `cd client/`

13. You're ready to run QuillLMS! Switch back into the QuillLMS directory `cd ..`

    1. Run the server using the command `foreman start -f Procfile.static`.
    2. Navigate your browser to [localhost:3000](http://localhost:3000).
    3. When you're done with the server, use Ctrl-C to break it and return to your command line.

14. Optional: To play through activities locally, start LMS via `npm run start:prod-cms` rather than `Procfile.static`. This points the local LMS to production CMS.


In case you are unable to start QuillLMS on your computer, please submit and issue. If you found a work around, we would also love to read your suggestions!

For more information on setting up and launching QuillLMS, visit the [docs](https://docs.quill.org/misc/setting_up.html).

## Test Suite
- backend
```ruby
bundle exec rspec spec
```
- frontend
TBD

## Deployment
```bash
bash deploy.sh staging|staging2|sprint|prod
```

## Infrastructure
[staging (Heroku)](https://dashboard.heroku.com/apps/empirical-grammar-staging)
[staging 2 (Heroku)](https://dashboard.heroku.com/apps/empirical-grammar-staging2)
[sprint (Heroku)](https://dashboard.heroku.com/apps/quill-lms-sprint)
[production (Heroku)](https://dashboard.heroku.com/apps/empirical-grammar)
