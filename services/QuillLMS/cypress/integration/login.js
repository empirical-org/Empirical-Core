describe('Login page', function() {

  before(function() {
    cy.cleanDatabase()
    cy.factoryBotCreate({
      factory: 'teacher',
      password: 'password',
      username: 'teacher'
    })
    cy.factoryBotCreate({
      factory: 'student',
      password: 'password',
      username: 'student'
    })
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
