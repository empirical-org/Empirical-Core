heroku pgbackups:restore DATABASE_URL `heroku pgbackups:url --app empirical-grammar` --app empirical-grammar-staging --confirm empirical-grammar-staging
heroku run rake db:migrate --app empirical-grammar-staging
