const faker = require('faker');

describe('Sign Up page', function() {

  after(function() {
    cy.logout()
  })

  before(function() {
    cy.cleanDatabase()
    cy.factoryBotCreate({
      factory: 'school',
      name: 'Cool Bushwick School',
      zipcode: 11221
    }).then(() => {
      cy.visit('/account/new')
    })
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('_quill_session')
  })
  it('shows two options', function() {
    cy.contains('Educator')
    cy.contains('Student')
  })

  describe('I am an educator with an original email and a listed school', function() {
    it ('clicking educator takes me to a sign up form', function() {
      cy.contains('Educator').click()

      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()
      const email = faker.internet.email()

      cy.get('#first_name')
      .type(firstName)
      .should('have.value', firstName)

      cy.get('#last_name')
      .type(lastName)
      .should('have.value', lastName)

      cy.get('#email')
      .type(email)
      .should('have.value', email)

      cy.get('#password')
      .type('TheTr1@l')
      .should('have.value', 'TheTr1@l')

      cy.get('.new-teacher-account > .sign-up-button').click()

    })

    it('asks if I am a faculty member at a U.S K-12 School', function() {
      cy.contains('Yes').click()
    })

    it ('has an input field for a zip code', function() {
      cy.get('#zip').type('11221')
    })

    it ('populates options for the schools in that zipcode', function() {
      cy.get('select').select('Cool Bushwick School')
    })

    it ('has a Confirm School button', function() {
      cy.contains('Confirm School').click()
    })

  })

  describe('I am a student with a unique username', function() {
    it ('clicking student takes me to a sign up form', function() {
      cy.visit('/account/new')
      cy.contains('Student').click()

      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()
      const email = faker.internet.email()
      const username = faker.internet.userName()

      cy.get('#first_name')
      .type(firstName)
      .should('have.value', firstName)

      cy.get('#last_name')
      .type(lastName)
      .should('have.value', lastName)

     cy.get('#username')
        .type(username)
        .should('have.value', username)

      cy.get('#email')
      .type(email)
      .should('have.value', email)

      cy.get('#password')
      .type('password')
      .should('have.value', 'password')

      cy.get('.new-student-account > .sign-up-button').click()
    })

    it('brings me to a different page', function() {
      cy.url().should('not.include', 'account')
    })

  })

  describe('I am a student with a non-unique usernsame', function() {
    before(function() {
      cy.cleanDatabase()
      cy.factoryBotCreate({
        factory: 'student',
        username: 'student',
      }).then(() => {
        cy.visit('/account/new')
      })
      beforeEach(() => {
        Cypress.Cookies.preserveOnce('_quill_session')
      })
    })

    it ('clicking student takes me to a sign up form', function() {
      cy.contains('Student').click()

      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()
      const email = faker.internet.email()

      cy.get('#first_name')
      .type(firstName)
      .should('have.value', firstName)

      cy.get('#last_name')
      .type(lastName)
      .should('have.value', lastName)

     cy.get('#username')
        .type('student')
        .should('have.value', 'student')

      cy.get('#email')
      .type(email)
      .should('have.value', email)

      cy.get('#password')
      .type('password')
      .should('have.value', 'password')

      cy.get('.new-student-account > .sign-up-button').click()
    })

    it('shows me an error after I submit a non-unique username', function() {
      cy.contains('Username has already been taken.')
    })

  })

})
