describe('Teacher changes activity due date', () => {
  before( function() {
    cy.app('clean')
  })

  it('they see the change persisted', () => {
    cy.appFactories([
      ['create', 'simple_user', {
        id: 101,
        role: 'teacher',
        password: 'password',
        email: 'someone@gmail.com',
      }],
      ['create', 'simple_user', {
        id: 102,
        role: 'student',
      }],
      ['create', 'simple_classroom', {
        id: 101,
      }],
      ['create', 'classrooms_teacher', {
        classroom_id: 101,
        user_id: 101,
        role: 'owner',
      }],
      ['create', 'students_classrooms', {
        classroom_id: 101,
        student_id: 102,
      }],
      ['create', 'simple_activity', {
        id: 101,
        name: 'Cool Activity',
      }],
      ['create', 'simple_unit', {
        name: 'Monkey With Typewriters',
        id: 101,
        user_id: 101,
      }],
      ['create', 'unit_activity', {
        unit_id: 101,
        activity_id: 101,
      }],
      ['create', 'classroom_unit', {
        classroom_id: 101,
        unit_id: 101,
      }]
    ])

    cy.login('someone@gmail.com', 'password')
    cy.visit('/')

    cy.contains('My Activities').click()

    cy.get('input.due-date-input').should('not.have.value')

    cy.get('input.due-date-input').click()
    cy.contains('15').click()
    cy.contains('Apply to All').click()

    cy.reload()
    cy.get('input.due-date-input')
      .should('have.attr', 'value')
      .and('match', /\d{2}\/15\/\d{4}/)
  })
})
