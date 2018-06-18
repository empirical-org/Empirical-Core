# given a build tag, create a database yml


echo "
test:
  adapter: postgresql
  encoding: unicode
  database: quill_comprehension_test
  host:     lms-testdb$1
  username: postgres
" > $2

