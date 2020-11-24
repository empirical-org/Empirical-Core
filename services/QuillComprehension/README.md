# Quill Comprehension

## Installation / Setup

### Version Info
Ruby: 2.5.1  
Rails: 5.2.0

### System Dependencies
Quill Comprehension uses [Yarn](https://yarnpkg.com/lang/en/) to manage dependencies. To install dependencies from `yarn.lock` and gems from `Gemfile`:
```
$ yarn
$ bundle update
```
### Database Creation/Initialization
Duplicate `config/database.yml.example` and rename it `config/database.yml`

To set up the proper database schema, run:
```
$ rails db:create
$ rails db:migrate
```

### Seed data
To get initial data in your db, run:

```
$ rails db:seed
```

### Launching
To launch Quill Comprehension:
```
$ rails server
```

## Test Suite
If you'd like to run tests:
```
$ bundle exec rspec
```

## Deployment
```bash
bash deploy.sh prod
```

## Infrastructure
TBD

## Other

Things we may want to cover in README:

* Configuration

* Services (job queues, cache servers, search engines, etc.)

* ...
