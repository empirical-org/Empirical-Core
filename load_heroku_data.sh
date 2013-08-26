heroku pgbackups:capture --expire --app empirical-grammar
curl -o latest.dump `heroku pgbackups:url --app empirical-grammar`
pg_restore --verbose --clean --no-acl --no-owner -h localhost -d emp_gr_development latest.dump
# rm latest.dump
