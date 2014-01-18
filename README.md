# Welcome to Quill!

Quill is an open platform for providing interactive grammar lessons.

* * *

[![Code Climate](https://codeclimate.com/github/empirical-org/quill.png)](https://codeclimate.com/github/empirical-org/quill)
[![Build Status](https://travis-ci.org/empirical-org/quill.png)](https://travis-ci.org/empirical-org/quill)
[![Coverage Status](https://coveralls.io/repos/empirical-org/quill/badge.png?branch=master)](https://coveralls.io/r/empirical-org/quill?branch=master)
[![Dependency Status](https://gemnasium.com/empirical-org/quill.png)](https://gemnasium.com/empirical-org/quill)

Contributing
------------

Quill is built and maintained by a core team and volunteers. If you have ideas
on how to improve Quill, or just want to help, please join us! 

1.  Check our [Github issue queue](https://github.com/empirical-org/quill/issues?state=open) for ideas on how to help. 
2.  Make sure your code follows [Ruby](https://github.com/styleguide/ruby) and project conventions.
3.  Make sure you don't have any IDE / platform specific files committed. i.e.
    `.DS_Store`, `.idea`, `.project` (consider adding these to a [global gitignore](https://help.github.com/articles/ignoring-files#global-gitignore)).
4.  Before commiting, run `rake`, make sure all tests pass.
5.  Introduce changes with pull requests. 

Read our [guide to contributing](https://github.com/empirical-org/quill/blob/master/CONTRIBUTING.md) for more information.

Building
--------

A good place to start is by setting up and running Quill on your
local machine.

**If you are having any trouble installing, [please post your questions here](http://empirical-discourse.herokuapp.com/t/quill-installation-guide).**

*Note:* Unless stated otherwise, all commands assume that your current working
directory is the Quill application root.

0.  Setup ruby 1.9.3. You can use RVM or rbenv to achieve this, rbenv is recommended (https://github.com/sstephenson/rbenv).

1.  Install dependencies.

        bundle install

    *Note*: This may require you to install missing system packages using your
    system package handler (`brew`, `apt`, `yum`, etc.).

2.  Set up your database configuration by creating and editing the file
    `config/database.yml` with appropriate connection information. Example
    information is provided below.

        development:
            host: localhost
            adapter: postgresql
            encoding: unicode
            database: <database_name>
            pool: 5
            username: my_name
            password: my_pass

3.  Build the database structure.

    ~~~ sh
    sudo service postgres start   # may change depending on your OS

    rake db:create
    rake db:schema:load
    ~~~

4.  Seed data into the database. 

        rake db:seed
        
    If you are granted access to a Heroku environment, you can also capture a
    database directly from that. Instructions below are for example only.

        heroku pg:capture --app <app>
        curl -o ~/latest.dump $(heroku pgbackups:url --app <app>)
        pg_restore --verbose --clean --no-acl --no-owner -h localhost -U <your_db_user> -d <database_name> ~/latest.dump
    
    *Note*: `<app>` is the name of the Quill deployment on Heroku you want to
    retrieve data from.

5.  Ensure the following parameters are in your environment:

        JRUBY_OPTS=--1.9
        APP_SECRET=your-secret-key
        HOMEPAGE_CHAPTER_ID=1

    Setting these up varies on your platform. You can `export` them in your bash config (not recommended) or use a config  file provided by either RVM (.ruby-env) or rbenv (.rbenv-vars). Please refer to their respective documentations if you need more information. 

6.  Start the app, make sure it works.

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

Find us on IRC at **#quill**!
