heroku pgbackups:capture --expire --app empirical-grammar-staging
curl -o latest.dump `heroku pgbackups:url --app empirical-grammar-staging`
echo "drop schema public cascade; create schema public;" | psql -h 127.0.0.1 -d emp_gr_development
pg_restore --verbose --clean --no-acl --no-owner -h 127.0.0.1 -d emp_gr_development latest.dump
rake db:migrate
