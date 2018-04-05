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

There are three means of creating test data that are currently employed in our Cypress suite:

1. When the value of the test data does not need to reflect something in the database (ie, for sign up), we use the `faker` npm package to generate data.

2. When we need to use data that comes from a database, we can create the data we need by sending requests to the factories controller through the Cypress commands factoryBotCreate and factoryBotCreateList. See the Commands section below for more detail on these commands.

The third option, below, was used when we were first implementing Cypress, but has since been replaced by the factories controller and should no longer be used. In fact, we should rewrite these tests to use the factories controller instead.

 3. When we need to use data that does exist in our database, we create it when necessary through rake tasks that live in `lib/tasks/find_or_create_cypress_test_data.rake`.

## Writing the Tests

### Best Practices

Cypress provides a guide to best practices [here](https://docs.cypress.io/guides/references/best-practices.html).

## Folders

### Fixtures

As of 3/15/18, we are not using any fixtures in our Cypress implementation. The example fixture files have been left for future reference.  You can read more about fixtures, in the event that you want to use them, [here](https://docs.cypress.io/api/commands/fixture.html).

### Support

#### Commands

##### login
`login` takes an email and password as arguments and makes a request to the `login_with_ajax` endpoint in the sessions controller. If the email and password are valid, the user identified by the email and password will be logged in and tests requiring a logged in user can be performed.

##### factoryBotCreate
`factoryBotCreate` takes a hash as an argument, with the name of the factory as a mandatory key and the attributes of the model and an array of traits as optional keys. Example:

```
`cy.factoryBotCreate({
  factory: 'teacher',
  traits: ['has_a_stripe_customer_id', 'signed_up_with_google'],
  name:    'Tommy Conroy'})
```

The command formats these arguments to be sent to the factories controller, where an instance of the specified model with the specified traits and attributes is instantiated using whatever is in the factories file for that model. The command returns the instantiated object.

##### factoryBotCreateList
`factoryBotCreateList` takes a hash as an argument, with the name of the factory and the number of records as mandatory keys and the attributes of the model and an array of traits as optional keys. Example:

```
cy.factoryBotCreateList({
  factory: 'teacher',
  traits: ['has_a_stripe_customer_id', 'signed_up_with_google'],
  flag: 'beta',
  number: 4
})
```

The command formats these arguments to be sent to the factories controller, where the specified number of instances of the specified model with the specified traits and attributes are instantiated using whatever is in the factories file for that model. The command returns an array of the instantiated objects.
