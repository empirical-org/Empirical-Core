describe('Staff enters terms in school manager search form', function() {
  before(function() {
    cy.app('clean')
  })

  it('they see filtered results', function() {
    cy.appFactories([
      ['create', 'simple_user', {
        role: 'staff',
        password: 'password',
        email: 'staff@example.com'
      }],
      ['create', 'simple_school', {
        name: 'School of Rock'
      }],
      ['create', 'simple_school', {
        name: 'School of Hard Knocks'
      }]
    ])

    cy.login('staff@example.com', 'password')
    cy.visit('/cms/schools')

    cy.get('input#school_name').type('School of Rock')
    cy.contains('Submit').click()

    cy.get('.ReactTable').contains('School of Rock').should('be.visible')
    cy.get('.ReactTable').contains('School of Hard Knocks').should('not.be.visible')
  })
})
