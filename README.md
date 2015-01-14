# Welcome to Empirical Core!

*All of our documentation lives within the [documentation repo](https://github.com/empirical-org/Documentation/tree/master/Compass).*
 
- **Getting Started:** [Start here with this doc.](https://github.com/empirical-org/Documentation/tree/master/Getting-Started) 
- **CLA:** [Please sign our CLA before contributing.] (https://www.clahub.com/agreements/empirical-org/Documentation)
- **Cofactor Empirical Core:** [Our project management HQ](http://www.empirical.org/cofactor/teams/compass)
- **Mailing List:** [Compass developers mailing list.](https://groups.google.com/forum/#!forum/empirical-compass)
- **Real Time Chat:** [Join us in the Compass Gitter room.](https://gitter.im/empirical-org/Compass)

# Empirical Easy Install

*Here is a guide to Empirical Core that makes installation and setup easy.*

If you want a simple guide to install Empirical Core, then you've come to the right place! Here's the step-by-step process to get Empirical Core running on your system:

1. Download and install [rbenv](https://github.com/sstephenson/rbenv) (or a Ruby version manager of your choice). You need to install Ruby version 2.1.2 to properly use Empirical Core. The best way to do this is follow the README and wiki of whatever Ruby version manager you download, but if you decide to use rbenv, then [homebrew](http://brew.sh/) has a really great and easy-to-use setup and install process:
  1. ```brew update```
  2. ```brew install rbenv ruby-build```
  3. ```echo 'eval "$(rbenv init -)"' >> ~/.bash_profile```
  4. Close and reopen your terminal.

2. Download and install [postgres](http://www.postgresql.org/), the database engine Empirical Core uses. The easiest way to get started with this is to download [postgres.app](http://postgresapp.com/). If you're more comfortable with installing custom software, you can use [homebrew](http://brew.sh/) to download and install postgres instead:
  1. ```brew update```
  2. ```brew install postgres```
  3. Follow the instructions on the resulting info screen.

3. Clone the Empirical Core project. Navigate to whatever directory you'd like Empirical Core to live in, and then use `git clone https://github.com/empirical-org/Empirical-Core.git`. From here on in, all the commands you have to type should be in the new Empirical Core directory you just downloaded, so you should probably `cd Empirical-Core`.

4. Install bundler with `gem install bundler`

5. Install the bundle with `bundle install`.

6. Set up your database with `bundle exec rake empirical:setup`.

7. Run the server with `bundle exec rails s`.

Now open your browser and navigate to localhost:3000 and you should see Empirical-Core pull up properly! When you're done with the server, use Ctrl-C to break it and return to your commandline.

The installation comes with three users, though you can create as many more as you like:

1. A teacher, username `teacher` and password `teacher`.
2. A student, username `student` and password `student`.
3. An admin, username `admin` and password `admin`.
