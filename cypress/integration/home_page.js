describe('Home page', function() {
  it('loads', function() {
    cy.visit('/')
  })

  it('has a link to the tools page', function() {
    cy.visit('/')
    cy.contains('Tools').click()

    cy.url().should('include', 'tools')
  })

  it('has a link to the featured activity packs page', function() {
    cy.visit('/')
    cy.contains('Resources').click()

    cy.url().should('include', 'activities/packs')
  })

  it('has a link to the mission page', function() {
    cy.visit('/')
    cy.contains('Our Story').click()

    cy.url().should('include', 'mission')
  })

  it('has a link to the login page', function() {
    cy.visit('/')
    cy.contains('Login').click()

    cy.url().should('include', 'session/new')
  })

  it('has a link to the sign up page', function() {
    cy.visit('/')
    cy.contains('Sign Up').click()

    cy.url().should('include', 'account/new')
  })

})

describe('the sign up flow', function() {
  it('loads', function() {
    cy.visit('//account/new')
  })

  it('shows two options', function() {
    cy.contains('Educator')
    cy.contains('Student')
  })

  describe('clicking on Educator', function() {
    it ('takes you to an educator form', function() {
      cy.contains('Educator').click()

      cy.get('#first_name')
      .type('Franz')
      .should('have.value', 'Franz')

      cy.get('#last_name')
      .type('Kafka')
      .should('have.value', 'Kafka')

      cy.get('#email')
      .type('sadboy@gmail.com')
      .should('have.value', 'sadboy@gmail.com')

      cy.get('#password')
      .type('TheTr1@l')
      .should('have.value', 'TheTr1@l')

    })

  })

  describe('the login flow', function() {
    it('loads', function() {
      cy.visit('//session/new')
    })

    it('logs me in', function() {

      cy.get('input[name="user[email]"]')
      .type('emilia@quill.org')
      .should('have.value', 'emilia@quill.org')

      cy.get('input[name="user[password]"]')
      .type(`Emilia29{enter}`)
      // .should('have.value', `Emilia29`)

      // cy.contains('Login').click()
      cy.url().should('include', 'profile')

    })


  })

})
