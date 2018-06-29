# given a build tag, create a database yml


echo "
test:
  adapter: postgresql
  encoding: unicode
  database: empiricalgrammar_test<%= ENV['TEST_ENV_NUMBER'] %>
  host:     lms-testdb$1
  username: postgres
" > $2

