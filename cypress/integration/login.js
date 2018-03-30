describe('Login page', function() {

  before(function() {
    cy.exec('RAILS_ENV=cypress spring rake find_or_create_cypress_test_data:find_or_create_users', {failOnNonZeroExit: false})
  })

  after(() => {
    cy.logout()
  })

  it('loads', function() {
    cy.visit('/session/new')
  })

  describe('correct info', function() {
    it('lets me enter my info', function() {
      cy.get('input[name="user[email]"]')
      .type('teacher')
      .should('have.value', 'teacher')

      cy.get('input[name="user[password]"]')
      .type('password{enter}')

    })
    it('brings me to a different page', function() {
      cy.url().should('not.include', 'session')
    })

  })

  describe('incorrect info', function() {
    it('lets me enter my info', function() {
      cy.visit('/session/new')
      cy.get('input[name="user[email]"]')
      .type('student')
      .should('have.value', 'student')

      cy.get('input[name="user[password]"]')
      .type('notmypassword{enter}')
    })

    it('shows an error', function() {
      cy.contains('Incorrect username/email or password')
    })

  })

  describe('testing cypress login command', function() {
    it('logs me in', function() {
      cy.visit('/session/new')
      cy.login('teacher', 'password')
      cy.visit('/profile')
    })
  })

})
