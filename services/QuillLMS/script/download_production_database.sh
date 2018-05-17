heroku pg:backups capture --app empirical-grammar --expire DATABASE_URL
heroku pg:backups restore `heroku pg:backups public-url --app empirical-grammar` DATABASE_URL --app empirical-grammar-staging --confirm empirical-grammar-staging
heroku run rake db:migrate --app empirical-grammar-staging