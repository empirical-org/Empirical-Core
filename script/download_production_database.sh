heroku pg:backups capture --expire --app empirical-grammar
heroku pg:backups restore `heroku pg:backups public-url --app empirical-grammar` DATABASE_URL --app empirical-grammar-staging --confirm empirical-grammar-staging
heroku run rake db:migrate --app empirical-grammar-staging