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

const openSocket = require('socket.io-client');
const socket     = openSocket('http://localhost:8000');

Cypress.Commands.add('cleanDatabase', () => {
  socket.emit('cleanDatabase', (acknowledgement) => {
    if (acknowledgement === 'ok') {
      console.log('cleaned')
    } else {
      throw 'Unable to clean database'
    }
  })
})

Cypress.Commands.add('addSlideToEdition', (slideType) => {
  cy.get('.add-new-slide-form').find('select').select(slideType)
  cy.get('.add-new-slide-form').find('a').contains('Add Slide').click()
})

Cypress.Commands.add('createPreviewLesson', () => {
  cy.visit('http://localhost:8080/#/admin/classroom-lessons')
  cy.get('.add-new-lesson-form').find('input').type('cool lesson')
  cy.get('.add-new-lesson-form').find('a').contains('Add New Lesson').click()

  cy.get('li:contains(\'cool lesson\')').last().find('a').contains('Edit').click()

  cy.wait(500)

  cy.get('.add-new-lesson-form').find('input').type('cool edition')
  cy.get('.add-new-lesson-form').find('a').contains('Add New Edition').click()

  cy.get('ul.classroom-lessons-index').find('li span:first').click()

  cy.addSlideToEdition('Static')
  cy.go('back')

  cy.addSlideToEdition('Model')
  cy.go('back')

  cy.addSlideToEdition('Single Answer')
  cy.go('back')

  cy.addSlideToEdition('Fill In The Blanks')
  cy.go('back')

  cy.addSlideToEdition('Fill In The List')
  cy.go('back')

  cy.addSlideToEdition('Multistep')
  cy.go('back')

  cy.get('h4').find('a').contains('cool lesson').click()
  cy.get('ul.classroom-lessons-index').within(() => {
    cy.get('li:first').find('span').contains('Preview').click()
  })
})
