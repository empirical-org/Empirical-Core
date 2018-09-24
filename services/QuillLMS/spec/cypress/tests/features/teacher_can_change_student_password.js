describe('Teacher changes a student password to their last name', () => {
  before( function() {
    cy.app('clean')
  })

  it('they see the change and are redirected to edit student page', () => {
    cy.appFactories([
      ['create', 'simple_user', {
        id: 101,
        role: 'teacher',
        password: 'password',
        email: 'someone@gmail.com'
      }],
      ['create', 'simple_classroom', { id: 101 }],
      ['create', 'classrooms_teacher', {
        user_id: 101,
        classroom_id: 101
      }],
      ['create', 'simple_user', {
        name: 'Joey Last-name-here',
        id: 102,
        role: 'student',
        password: 'something_else',
      }],
      ['create', 'students_classrooms', {
        student_id: 102,
        classroom_id: 101
      }]
    ])
    cy.login('someone@gmail.com', 'password')
    cy.visit('teachers/classrooms/')

    cy.get('a').contains('Edit Students').click({ force: true })

    cy.contains('Edit Account').click()

    cy.contains('Reset Password to Last Name').click()

    cy.get('input#user_password').should('have.value', 'Last-name-here')
    cy.contains('Save Changes').click()

    cy.get('h1').should('have.text', 'Edit Students')
  })
})
