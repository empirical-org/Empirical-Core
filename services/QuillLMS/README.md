## Documentation Table of Contents

* [API Controllers](https://github.com/empirical-org/Empirical-Core/blob/develop/app/controllers/api/README.md)
* [Authentication Controllers](https://github.com/empirical-org/Empirical-Core/blob/develop/app/controllers/auth/README.md)
* [Clever Integration](https://github.com/empirical-org/Empirical-Core/blob/develop/app/services/clever_integration/README.md)
* [CMS controllers](https://github.com/empirical-org/Empirical-Core/blob/develop/app/controllers/cms/README.md)
* [Google Integration](https://github.com/empirical-org/Empirical-Core/blob/develop/app/services/google_integration/README.md)



# Welcome to Empirical Core

Empirical Core is the Learning Management System that powers Quill.org, a free writing tool.


|Front End|Back End|Travis CI|Code Climate|Jenkins|
|---|---|---|---|---|
|[![codecov](https://codecov.io/gh/empirical-org/Empirical-Core/branch/{BRANCH_NAME}/graph/badge.svg?flag=jest)](https://codecov.io/gh/empirical-org/Empirical-Core)|[![codecov](https://codecov.io/gh/empirical-org/Empirical-Core/branch/{BRANCH_NAME}/graph/badge.svg?flag=rspec)](https://codecov.io/gh/empirical-org/Empirical-Core)|[![Build Status](https://travis-ci.org/empirical-org/Empirical-Core.svg?branch={BRANCH_NAME})](https://travis-ci.org/empirical-org/Empirical-Core)|[![Maintainability](https://api.codeclimate.com/v1/badges/01afdc9d25304bba229c/maintainability)](https://codeclimate.com/github/empirical-org/Empirical-Core/maintainability)|[![Build Status](https://jenkins.quill.org/buildStatus/icon?job=quill.org/{BRANCH_NAME})](https://jenkins.quill.org/job/quill.org/job/{BRANCH_NAME}/)|


***Badges refer to the state of the develop branch. The Master branch meets or exceeds the state of develop at all times.***



**Fork and Clone this repository to submit a Pull Request**.

**Getting Started:** [Visit our Community Page](http://community.quill.org/teams/quill-lms/). The Mailing List, Chat, Issues, and Docs can all be accessed from the community page.

**CLA:** [Please register an account & sign our CLA](http://community.quill.org/signup/cla/).

## Install Empirical Core

Here's how to get Empirical Core running on your system:

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

6. Install bundler with `gem install bundler`.

7. Install the bundle with `bundle install`.

8. Install node via [nvm](https://github.com/creationix/nvm#installation). Run `nvm install` to install the version of node used by this app.

9. Install npm by running `brew install npm`.

10. Run `rake empirical:setup` to automagically get all of your dependencies and databases configured.

11. You're ready to run Empirical Core!

    1. Run the server using the command `foreman start -f Procfile.static`.
    2. Navigate your browser to [localhost:3000](http://localhost:3000).
    3. When you're done with the server, use Ctrl-C to break it and return to your command line.

## Docs

We use GitBook for documentation. To get it set up, run `gitbook init` and then either `gitbook serve` (to run the book on a server) or `gitbook build` (to build a static version of the book). To add docs, create markdown files in the /docs folder and then add a relative link to the file in docs/SUMMARY.md.

## Pre-installed user accounts

The installation comes with some pre-populated data to help you get started:

* A teacher, with username `teacher` and password `password`.
* A student, username `student` and password `password`.
* A staff member, with username `staff` and password `password`.
