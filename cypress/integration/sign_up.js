const faker = require('faker');

describe('Sign Up page', function() {

  it('loads', function() {
    // cy.exec('rake db:drop', {failOnNonZeroExit: false})
    // cy.exec('rake db:create', {failOnNonZeroExit: false})
    // cy.exec('rake db:migrate', {failOnNonZeroExit: false})
    cy.visit('/account/new')
  })

  it('shows two options', function() {
    cy.contains('Educator')
    cy.contains('Student')
  })

  describe('clicking on Educator', function() {
    it ('takes you to a sign up form', function() {
      // cy.exec('rake db:reset db:seed', {failOnNonZeroExit: false})
      cy.contains('Educator').click()

      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()
      const email = faker.internet.email()

      cy.get('#first_name')
      // .type(`${firstName}`)
      // .should('have.value', `${firstName}`)
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

      cy.get('.sign-up-button').click()

    })
    it('asks if you are a faculty member at a U.S K-12 School', function() {
      cy.contains('Yes')
      cy.contains('No')

      describe('clicking yes', function() {
        it ('has an input field for a zip code', function() {
          cy.contains('Yes').click()
          cy.get('#zip').type('11221')
        })
      })

      describe('clicking no', function() {
        cy.contains('No').click()
      })

    })

  })

})
