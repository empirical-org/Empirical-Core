# README


## Installation / Setup
1. - clone the repo
1. - `brew install elasticsearch@6`
1. - `gem install bundler`
1. - `bundle install`
1. - either: `docker-compose up`
   - or use postgres.app: ```echo "DEV_POSTGRES_USER=`whoami` \nDEV_POSTGRES_PASSWORD= " >> .env ```
1. - `rake db:create`
1. - `rake db:migrate`
1. - `rake 'responses_csv:import['your/path/to/sample-responses.csv']'`
1. - `brew install elasticsearch@6`
1. - `brew services start elasticsearch@6`
1. - `rails c`
1. - `Response.__elasticsearch__.create_index!`
1. - `Response.__elasticsearch__.import`
1. - set up redis with ```redis-server --port 6400```
1. - `rails s`
1. - go to [localhost:3100](http://localhost:3100)

## Test Suite
```ruby
bundle exec rspec spec
```

## Deployment
Prerequisites:
- Ensure the elastic beanstalk CLI is [installed and configured](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html)
- ```QuillCMS$ eb init```
```bash
git checkout production && git pull
bash deploy.sh staging|prod
```

## Infrastructure
TODO