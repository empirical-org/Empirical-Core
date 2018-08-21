describe('Coteacher leaves class', () => {
  beforeEach(() => {
    cy.app('clean')
  })

  it('they see that class removed from Active Classes table', () => {
    cy.appFactories([
      ['create', 'simple_user', {
        id: 101,
        name: 'Co Teacher',
        role: 'teacher',
        password: 'password',
        email: 'someone@gmail.com',
      }],
      ['create', 'simple_user', {
        id: 102,
        role: 'teacher',
      }],
      ['create', 'simple_classroom', {
        name: 'Coteached Class',
        id: 101,
      }],
      ['create', 'classrooms_teacher', {
        id: 102,
        classroom_id: 101,
        user_id: 102,
        role: 'owner',
      }],
      ['create', 'classrooms_teacher', {
        id: 101,
        classroom_id: 101,
        user_id: 101,
        role: 'coteacher',
      }]
    ])

    cy.login('someone@gmail.com', 'password')
    cy.visit('teachers/classrooms/')

    cy.contains('Coteached Class').should('be.visible')

    cy.contains('Leave Classroom').click()

    cy.contains('Coteached Class').should('not.be.visible')
  })
})
