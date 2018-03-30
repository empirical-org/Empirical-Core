# Cypress Tests

We use [Cypress.io](https://www.cypress.io/) as an integration testing framework.

## Running the Tests

- add cypress to the `config/database.yml` file with the following code:

```
cypress:
  adapter: postgresql
  encoding: unicode
  database: emp_gr_test
  host:     localhost
```

 - start the server using the command `foreman start -f Procfile.cypress`

 - open Cypress using `npm run cypress:open`.

## The Cypress Environment

The Cypress environment is identical to the development environment, except that it will ignore CSRF issues (`config.action_controller.allow_forgery_protection = false` in the environment file). This means that *web requests that may fail token-based authentication must be QAed separately in the development environment.*

## Test Data

While we may want to use randomized seeding for our test database as our Cypress test coverage grows, we are currently using two mechanisms of data creation.

 - When the value of the test data does not need to reflect something in the database (ie, for sign up), we use the `faker` npm package to generate data.

 - When we need to use data that does exist in our database, we create it when necessary through rake tasks that live in `lib/tasks/find_or_create_cypress_test_data.rake`.

## Writing the Tests

### Best Practices

Cypress provides a guide to best practices [here](https://docs.cypress.io/guides/references/best-practices.html).

## Folders

### Fixtures

As of 3/15/18, we are not using any fixtures in our Cypress implementation. The example fixture files have been left for future reference.  You can read more about fixtures, in the event that you want to use them, [here](https://docs.cypress.io/api/commands/fixture.html).

### Support

#### Commands

We have one custom command: `login`, which takes an email and password as arguments and makes a request to the `login_with_ajax` endpoint in the sessions controller. If the email and password are valid, the user identified by the email and password will be logged in and tests requiring a logged in user can be performed.
