# Quill Comprehension

## Getting Started

#### System Dependencies
Quill Comprehension uses [Yarn](https://yarnpkg.com/lang/en/) to manage dependencies. To install dependencies from `yarn.lock` and gems from `Gemfile`:
```
$ yarn
$ bundle update
```
#### Database Creation/Initialization
Quill Comprehension stores data in PostgreSQL. To run on your local machine, you'll have to  create the Postgres database and migrate the schema from Rails:

In `config/database.yml`, change the development user to your own Postgres username.

Create a Postgres database named
 `quill_comprehension_development`. In psql, this can be done with:

```
$ createdb quill_comprehension_development
```

To set up the proper database schema, run:
```
$ rails db:migrate
```

#### Launching
To launch Quill Comprehension:
```
$ rails server
```

#### Test Suite
If you'd like to run tests:
```
$ bundle exec rspec
```

#### Version Info
Ruby: 2.5.1  
Rails: 5.2.0

#### Other

Things we may want to cover in README:

* Configuration

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...
