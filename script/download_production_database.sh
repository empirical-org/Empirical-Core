heroku pgbackups:capture --expire --app empirical-grammar
curl -o latest.dump `heroku pgbackups:url --app empirical-grammar`
