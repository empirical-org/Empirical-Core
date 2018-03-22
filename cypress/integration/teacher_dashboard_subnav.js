describe('Teacher Dashboard Subnav', function() {

  before(function() {
    cy.exec('RAILS_ENV=cypress rake find_or_create_cypress_test_data:find_or_create_teacher_with_classroom', {failOnNonZeroExit: false})
    cy.login('teacher', 'password')
    cy.visit('/')
  })

  beforeEach(function() {
    Cypress.Cookies.preserveOnce("_quill_session")
  })

  it('has a link to the Home page', function() {
    cy.get('#teacher-nav-tabs').contains('Home').click({force: true})
    cy.url().should('include', '/mission')
  })

  it('has a link to the Impact page', function() {
    cy.get('#teacher-nav-tabs').contains('Impact').click({force: true})
    cy.url().should('include', '/impact')
  })

  it('has a link to the Announcements page', function() {
    cy.get('#teacher-nav-tabs').contains('Announcements').click({force: true})
    cy.url().should('include', '/announcements')
  })

  it('has a link to the In the Press page', function() {
    cy.get('#teacher-nav-tabs').contains('In the Press').click({force: true})
    cy.url().should('include', '/press')
  })

  it('has a link to the Team page', function() {
    cy.get('#teacher-nav-tabs').contains('Team').click({force: true})
    cy.url().should('include', '/team')
  })

  it('has a link to the Donate page', function() {
    cy.get('#teacher-nav-tabs').contains('Donate').should('have.attr', 'href').should('match', /donate/)
  })

})
