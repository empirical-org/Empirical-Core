describe('User Manager', function() {
  before(function() {
    cy.cleanDatabase()
    cy.factoryBotCreate({
      factory: 'staff',
      password: 'password',
      email: 'staff@gmail.com'
    }).then(() => {
      cy.login('staff@gmail.com', 'password')
    })
  })

  beforeEach(function() {
    Cypress.Cookies.preserveOnce('_quill_session')
  })

  it('loads', function() {
    cy.visit('/cms/users')
    cy.contains('User Directory')
  })

  after(function() {
    cy.logout()
  })

})
