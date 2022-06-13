
# Welcome to Empirical Core

Empirical-Core is our web app for managing students, assigning activities, and viewing results

**Fork and Clone this repository to submit a Pull Request**.

## Install QuillLMS

QuillLMS is the Learning Management System that powers Quill.org. It is part of Empirical-Core Here's how to get QuillLMS running on your system:

1. Download and install [rbenv](https://github.com/sstephenson/rbenv) (or another Ruby version manager of your choice). You need to have Ruby version 2.5.1 installed in order to use Empirical Core. The best way to make sure you have version 2.5.1 is to follow the README and wiki of the Ruby version manager that you download.

    If you decide to use rbenv, then [homebrew](http://brew.sh/) has a really great and easy-to-use setup and install process:

    1. `brew update`
    2. `brew install rbenv ruby-build`
    3. `echo 'eval "$(rbenv init -)"' >> ~/.bash_profile`
    4. Close and reopen your terminal.


2. Download and install [postgres](http://www.postgresql.org/), the database engine Empirical Core uses. The easiest way to get started with this is to download [postgres.app](http://postgresapp.com/).

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

11. Run `rake empirical:setup` to automagically get all of your dependencies and databases configured.

12. You're ready to run QuillLMS!

    1. Run the server using the command `foreman start -f Procfile.static`.
    2. Navigate your browser to [localhost:3000](http://localhost:3000).
    3. When you're done with the server, use Ctrl-C to break it and return to your command line.
