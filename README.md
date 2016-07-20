[![Code Climate](https://codeclimate.com/github/empirical-org/Empirical-Core/badges/gpa.svg)](https://codeclimate.com/github/empirical-org/Empirical-Core) [![Test Coverage](https://codeclimate.com/github/empirical-org/Empirical-Core/badges/coverage.svg)](https://codeclimate.com/github/empirical-org/Empirical-Core/coverage)

# Welcome to Empirical Core

**Fork and Clone this repository to submit a Pull Request**

**Getting Started:** [Visit our Community Page](http://community.quill.org/teams/quill-lms/)

**CLA:** [Please register an account & sign our CLA.] (http://community.quill.org/signup/cla/)

The Mailing List, Chat, Issues, and Docs can all be accessed from the community page.

# Empirical Easy Install

*Here is a guide to Empirical Core that makes installation and setup easy.*

If you want a simple guide to install Empirical Core, then you've come to the right place! Here's the step-by-step process to get Empirical Core running on your system:

1. Download and install [rbenv](https://github.com/sstephenson/rbenv) (or a Ruby version manager of your choice). You need to install Ruby version 2.3.0 to properly use Empirical Core. The best way to do this is follow the README and wiki of whatever Ruby version manager you download, but if you decide to use rbenv, then [homebrew](http://brew.sh/) has a really great and easy-to-use setup and install process:
  1. ```brew update```
  2. ```brew install rbenv ruby-build```
  3. ```echo 'eval "$(rbenv init -)"' >> ~/.bash_profile```
  4. Close and reopen your terminal.

2. Download and install [postgres](http://www.postgresql.org/), the database engine Empirical Core uses. The easiest way to get started with this is to download [postgres.app](http://postgresapp.com/). If you're more comfortable with installing custom software, you can use [homebrew](http://brew.sh/) to download and install postgres instead:
  1. ```brew update```
  2. ```brew install postgres```
  3. Follow the instructions on the resulting info screen.

3. Clone the Empirical Core project. Navigate to whatever directory you'd like Empirical Core to live in, and then use `git clone https://github.com/empirical-org/Empirical-Core.git`. From here on in, all the commands you have to type should be in the new Empirical Core directory you just downloaded, so you should probably `cd Empirical-Core`.

4. Install Redis. You can either [download it directly](http://redis.io/download), or you can use [homebrew](http://brew.sh/) instead:
	1. ```brew update```
	2. ```brew install redis```

5. To run `js: true`/`:js`-tagged `feature` specs, [install PhantomJS](https://github.com/teampoltergeist/poltergeist#installing-phantomjs)

6. Install bundler with `gem install bundler`

7. Install the bundle with `bundle install`.

8. Set up your database with `rake empirical:setup`.

9. Run Redis with ```redis-server```

11. Run npm installer with ```npm install && cd ./client && npm install```


10. Run the server with `foreman start -f Procfile.static`.
 - Navigate your browser to localhost:3000 and you should see Empirical-Core pull up properly!
 - When you're done with the server, use Ctrl-C to break it and return to your commandline.

11. Run `bin/guard` to have [Guard](https://github.com/guard/guard-rspec) run
    specs when you save files.

The installation comes with three users, though you can create as many more as you like:

1. A teacher, username `teacher` and password `teacher`.
2. A student, username `student` and password `student`.
3. An admin, username `admin` and password `admin`.
4. An admin, username `staff` and password `staff`.


# Documentation related to specific features

api controllers
* https://github.com/empirical-org/Empirical-Core/blob/develop/app/controllers/api/README.md

authentication controllers
* https://github.com/empirical-org/Empirical-Core/blob/develop/app/controllers/auth/README.md

cms controllers
* https://github.com/empirical-org/Empirical-Core/blob/develop/app/controllers/cms/README.md

clever integration
* https://github.com/empirical-org/Empirical-Core/blob/develop/app/services/clever_integration/README.md

google integration
* https://github.com/empirical-org/Empirical-Core/blob/develop/app/services/google_integration/README.md
