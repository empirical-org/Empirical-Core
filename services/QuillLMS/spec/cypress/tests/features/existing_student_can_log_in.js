describe('Student enters credentials in log-in form', () => {
  beforeEach(() => {
    cy.app('clean')
  })

  it('they are redirected to a page with a "logged-in" navigation', () => {
    cy.appFactories([
      ['create', 'simple_user', {
        id: 101,
        name: 'Jane Doe',
        role: 'student',
        email: 'cool@dude.com',
        password: 'password'
      }],
      ['create', 'simple_classroom', { id: 101 }],
      ['create', 'students_classrooms', { student_id: 101, classroom_id: 101}]
    ])

    cy.visit('/')
    cy.contains('Log In').click()

    cy.get('input#email').type('cool@dude.com')
    cy.get('input#password').type('password')
    cy.get('input').contains('Log In').last().click()

    cy.contains('Logout').should('be.visible')
  })
})
