describe('School Manager', function() {
  before(function() {
    cy.cleanDatabase()
    cy.factoryBotCreate({
      factory: 'staff',
      password: 'password',
      email: 'staff@gmail.com'
    }).then(() => {
      cy.factoryBotCreate({
        factory: 'school_with_three_teachers'
      }).then(() => {
      cy.login('staff@gmail.com', 'password')
      })
    })
  })

  beforeEach(function() {
    Cypress.Cookies.preserveOnce('_quill_session')
  })

  it('loads', function() {
    cy.visit('/cms/schools')
    cy.contains('School Directory')
  })

  after(function() {
    cy.logout()
  })

})
