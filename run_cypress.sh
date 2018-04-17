REACT_ON_RAILS_ENV=cypress RAILS_ENV=cypress rails s -b 0.0.0.0 &
RAILS_ENV=cypress bundle exec sidekiq -c 5 -v & 
wait-on localhost:3000
./node_modules/cypress/bin/cypress run