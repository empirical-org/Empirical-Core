describe('Teacher archives class', () => {
  beforeEach(() => {
    cy.app('clean')
  })

  it('they see archived class as an inactive class', () => {
    cy.appFactories([
      ['create', 'teacher', 'with_classrooms_students_and_activities', {
        password: 'password',
        email: 'someone@gmail.com',
      }]
    ])

    cy.login('someone@gmail.com', 'password')
    cy.visit('teachers/classrooms/')

    cy.contains('Inactive Classes').should('not.be.visible')

    cy.contains('Archive').click()

    cy.contains('Inactive Classes').should('be.visible')
  })
})
