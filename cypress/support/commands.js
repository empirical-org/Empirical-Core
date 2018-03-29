// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (emailOrUsername, password) => {
  cy.request({
    url: '/session/login_through_ajax',
    method: 'POST',
    json: { user: {email: emailOrUsername, password: password} },
  })
})
Cypress.Commands.add('logout', () => {
  cy.request({
    url: '/session',
    method: 'get',
  })
})
Cypress.Commands.add('factoryBotCreate', (args) => {
  let factory = args.factory
  let traits  = args.traits
  delete args.factory
  delete args.traits

  let body = Object.assign(args, { factory })

  if (traits) {
    body.traits = traits
  }

  cy.request({
    url: '/factories',
    method: 'post',
    form: true,
    failOnStatusCode: true,
    body
  })
})
Cypress.Commands.add('cleanDatabase', () => {
  cy.request({
    url: '/factories/destroy_all',
    method: 'delete',
    failOnStatusCode: true,
  })
})

