# Empirical Easy Install

*Here is a guide to Empirical Core that makes installation and setup easy.*

If you want a simple guide to install Empirical Core, then you've come to the right place! Here's the step-by-step process to get Empirical Core running on your system:

1. Download and install [rbenv](https://github.com/sstephenson/rbenv) (or another Ruby version manager of your choice). You need to have Ruby version 2.3.1 installed in order to use Empirical Core. The best way to make sure you have version 2.3.1 is to follow the README and wiki of the Ruby version manager that you download.

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

3. Navigate to the directory where you'd like Empirical Core to live, then run the following command to clone the Empirical Core project repository:

    `git clone https://github.com/empirical-org/Empirical-Core.git`

4. Use `cd Empirical-Core` to change directory into the Empirical Core repository.

5. Install Redis. You can [download it directly](http://redis.io/download).

    Alternatively, you can use [homebrew](http://brew.sh/) to install it by running the following commands:

    1. `brew update`
    2. `brew install redis`

6. To run `js: true`/`:js`-tagged `feature` specs, [install PhantomJS](https://github.com/teampoltergeist/poltergeist#installing-phantomjs).

7. Install bundler with `gem install bundler`.

8. Install the bundle with `bundle install`.

9. In the config folder, delete the ".example" extension from database.yml.example so that the filename reads "database.yml" by running `mv database.yml.example database.yml`.

10. Set up your database by running `rake empirical:setup`.

11. Run Redis with the command `redis-server`

12. Run a second Redis instance (for caching) with the command `redis-server --port 7654`.

13. Run a third Redis instance (for testing) with the command `redis-server --port 6378`.

14. Install npm by running `brew install npm`.

15. Run npm installer with the command `npm install && cd ./client && npm install`.

16. Make sure to navigate back out of the "client" folder by running `cd ..`

17. Run the server locally.

    1. Run the server using the command `foreman start -f Procfile.static`.
    2. Navigate your browser to localhost:3000 and you should see Empirical-Core pull up properly!
    3. When you're done with the server, use Ctrl-C to break it and return to your commandline.

18. Run the command `bin/guard` so that [Guard](https://github.com/guard/guard-rspec) run
    specs when you save files.
