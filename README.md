# Welcome to Quill!

Quill is a web application that provides interactive writing activities.

[Read about our mission.](http://www.quill.org/mission)

* * *

[![Code Climate](https://codeclimate.com/github/empirical-org/Compass.png)](https://codeclimate.com/github/empirical-org/Compass)
[![Build Status](https://drone.io/github.com/empirical-org/Compass/status.png)](https://drone.io/github.com/empirical-org/Compass/latest)
[![Coverage Status](https://coveralls.io/repos/empirical-org/Compass/badge.png?branch=master)](https://coveralls.io/r/empirical-org/Compass?branch=master)
[![Dependency Status](https://gemnasium.com/empirical-org/Compass.png)](https://gemnasium.com/empirical-org/Compass)



Participating via Cofactor
--------

Quill is built and maintained by a core team and volunteers. Contributors are
organized into teams on Cofactor. Cofactor is a tool for collaboartively
building open source projects.

[If you have ideas on how to improve Quill, or just want to help, please join
us on our Cofactor page.](http://www.empirical.org/cofactor/teams/compass)

Using Cofactor, you can communicate via the following channels:

1. **Chat/IRC.**  Join our Gitter chat room for immediate discussions. Gitter is now building an IRC bridge.
2. **Mailing List**. Use the mailing list to discuss ideas, questions, and project direction.
3. **GitHub Issues.** Use GitHub issues to discuss particular features under development.
4. **Google Hangouts.** Video chats are organized through the Gitter chat.


Contributing
------------

1.  Check our [Github issue queue](https://github.com/empirical-org/Compass/issues?state=open) for ideas on how to help.
2.  Make sure your code follows [Ruby](https://github.com/styleguide/ruby) and project conventions.
3.  Make sure you don't have any IDE / platform specific files committed. i.e.
    `.DS_Store`, `.idea`, `.project` (consider adding these to a [global gitignore](https://help.github.com/articles/ignoring-files#global-gitignore)).
4.  Before commiting, run `rake`, make sure all tests pass.
5.  Introduce changes with pull requests.

Read our [guide to contributing](https://github.com/empirical-org/Compass/blob/master/CONTRIBUTING.md) for more information.



Building with Docker
--------

You can run Compass locally by using a Docker Image and a Virtual Machine. 
[Read the instructions](https://docs.google.com/a/quill.org/document/d/1wQKBstQbcKeTeQPQoooLpmLrn6Al5pOc77oMN-CDIOc/edit)


Building with Manual Install
--------

**If you are having any trouble installing, please post your questions to the ["Questions" mailing list in Cofactor.](http://www.empirical.org/cofactor/teams/compass)**

*Note:* Unless stated otherwise, all commands assume that your current working directory is the Quill application root.

0.  __Setup ruby 2.1.1. You can use RVM or rbenv to achieve this, rbenv is recommended (https://github.com/sstephenson/rbenv). Here are the steps for installing os OS X:__

    Install homebrew (if you haven't already): http://brew.sh/

    Install rbenv:

    ~~~ sh
    brew update
    brew install rbenv ruby-build
    ~~~

    Install ruby:

    ~~~ sh
    rbenv install 2.1.1
    ~~~

    Set it to your default ruby:

    ~~~ sh
    rbenv local 2.1.1
    ~~~

    *Note*: you may need to run `brew upgrade ruby-build` if 2.1.1 is
unavailable

1.  __Install dependencies.__

        bundle install

    *Note*: This may require you to install missing system packages using your
    system package handler (`brew`, `apt`, `yum`, etc.).

    Ensure that Postgres is installed. On Macs:

    ~~~ sh
    brew install postgres
    initdb /usr/local/var/postgres
    postgres -D /usr/local/var/postgres & #start the server
    createuser -s -r postgres
    psql postgres # if this works, you win
    ~~~

    Update submodules

    ~~~ sh
    git submodule init
    git submodule update
    ~~~

2.  __Set up your database configuration by creating and editing the file
    `config/database.yml` with appropriate connection information. Example
    information is provided below.__

        development:
            host: localhost
            adapter: postgresql
            encoding: unicode
            database: <database_name>
            pool: 5
            username: my_name
            password: my_pass

3.  __Build the database structure.__

    ~~~ sh
    sudo service postgres start   # may change depending on your OS

    rake db:create
    rake db:structure:load
    ~~~

4.  __Seed data into the database.__

        rake db:seed

    If you are granted access to a Heroku environment, you can also capture a
    database directly from that. Instructions below are for example only.

        heroku pg:capture --app <app>
        curl -o ~/latest.dump $(heroku pgbackups:url --app <app>)
        pg_restore --verbose --clean --no-acl --no-owner -h localhost -U <your_db_user> -d <database_name> ~/latest.dump

    *Note*: `<app>` is the name of the Quill deployment on Heroku you want to
    retrieve data from.

5.  __Ensure the following parameters are in your environment:__

        JRUBY_OPTS=--1.9
        APP_SECRET=your-secret-key
        HOMEPAGE_CHAPTER_ID=1

    Setting these up varies on your platform. You can `export` them in your bash config (not recommended) or use a config  file provided by either RVM (.ruby-env) or rbenv (.rbenv-vars). Please refer to their respective documentations if you need more information.

6.  __Start the app, make sure it works.__

    ~~~ sh
    rails server
    curl localhost:3000
    ~~~

Benchmarking
------------

```
user = User.first
user.refresh_token!
token = user.token

$ ab -H "Authorization: Basic `echo TOKEN_GOES_HERE: | base64`==" -n 5 -c 1 http://www.quill.org/profile
```

Help
----

Request help on [Gitter](https://gitter.im/empirical-org/Compass) or on our [Mailing List](http://www.empirical.org/cofactor/teams/compass).
