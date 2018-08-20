describe('Teacher enters credentials in log-in form', () => {
  beforeEach(() => {
    cy.app('clean')
  })

  it('they are redirected to a page with a "logged-in" dropdown', () => {
    cy.appFactories([
      ['create', 'simple_user', {
        name: 'Jane Doe',
        role: 'teacher',
        email: 'cool@dude.com',
        password: 'password'
      }]
    ])

    cy.visit('/')
    cy.contains('Log In').click()

    cy.get('input#email').type('cool@dude.com')
    cy.get('input#password').type('password')
    cy.get('input').contains('Log In').last().click()

    cy.contains('Jane Doe').click()
    cy.contains('Logout').should('be.visible')
  })
})
