describe('User Manager', function() {
  before(function() {
    cy.app('clean')
    cy.appFactories([
      ['create', 'staff', {
        password: 'password',
        email: 'staff@gmail.com'
      }]
    ])
    cy.login('staff@gmail.com', 'password')
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
