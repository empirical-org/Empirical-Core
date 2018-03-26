describe('Home page', function() {
  beforeEach(function() {
    cy.logout();
    cy.visit('/')
  })

  it('loads', function() {
    cy.visit('/')
  })

  it('has a link to the tools page', function() {
    cy.contains('Tools').click()

    cy.url().should('include', 'tools')
  })

  it('has a link to the featured activity packs page', function() {
    cy.contains('Resources').click()

    cy.url().should('include', 'activities/packs')
  })

  it('has a link to the mission page', function() {
    cy.contains('Our Story').click()

    cy.url().should('include', 'mission')
  })

  it('has a link to the login page', function() {
    cy.contains('Login').click()

    cy.url().should('include', 'session/new')
  })

  it('has a link to the sign up page', function() {
    cy.contains('Sign Up').click()

    cy.url().should('include', 'account/new')
  })

})
