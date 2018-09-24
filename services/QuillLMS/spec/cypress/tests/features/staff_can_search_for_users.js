describe('Staff enters terms in user manager search form', function() {
  before(function() {
    cy.app('clean')
  })

  it('they see results return', function() {
    cy.appFactories([
      ['create', 'simple_user', {
        name: 'Jimmy Netron',
        role: 'staff',
        password: 'password',
        email: 'staff@example.com'
      }],
      ['create', 'simple_user', {
        name: 'Ariana Grande',
        role: 'student',
        email: 'ariana@example.com',
      }]
    ])

    cy.login('staff@example.com', 'password')
    cy.visit('/cms/users')

    cy.get('input#user_name').type('Ariana Grande')
    cy.contains('Submit').click()

    cy.get('.ReactTable').contains('Ariana Grande').should('be.visible')
    cy.get('.ReactTable').contains('Jimmy Netron').should('not.be.visible')
  })
})
