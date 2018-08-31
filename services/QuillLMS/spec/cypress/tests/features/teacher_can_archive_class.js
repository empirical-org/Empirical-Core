describe('Teacher archives class', () => {
  beforeEach(() => {
    cy.app('clean')
  })

  it('they see archived class as an inactive class', () => {
    cy.appFactories([
      ['create', 'simple_user', {
        id: 101,
        role: 'teacher',
        password: 'password',
        email: 'someone@gmail.com',
      }],
      ['create', 'simple_classroom', {
        id: 101
      }],
      ['create', 'classrooms_teacher', {
        classroom_id: 101,
        user_id: 101,
        role: 'owner'
      }]
    ])

    cy.login('someone@gmail.com', 'password')
    cy.visit('teachers/classrooms/')

    cy.contains('Active Classes').should('be.visible')
    cy.contains('Inactive Classes').should('not.be.visible')

    cy.contains('Archive').click()

    cy.contains('Active Classes').should('not.be.visible')
    cy.contains('Inactive Classes').should('be.visible')
  })
})
