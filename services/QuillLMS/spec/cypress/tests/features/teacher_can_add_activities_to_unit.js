describe('Teacher adds activity to existing unit', () => {
  before(() => {
    cy.app('clean')
  })

  it('they see it added', () => {
    cy.appFactories([
      ['create', 'simple_user', {
        id: 101,
        role: 'teacher',
        password: 'password',
        email: 'someone@gmail.com',
      }],
      ['create', 'simple_user', {
        id: 102,
        role: 'student'
      }],
      ['create', 'simple_classroom', {
        id: 101
      }],
      ['create', 'classrooms_teacher', {
        classroom_id: 101,
        user_id: 101,
        role: 'owner'
      }],
      ['create', 'students_classrooms', {
        student_id: 102,
        classroom_id: 101,
      }],
      ['create', 'simple_activity', {
        id: 101,
        name: 'Added Activity',
      }],
      ['create', 'activity', {
        id: 102,
        name: 'Unadded Activity',
        flags: ['production'],
      }],
      ['create', 'simple_unit', {
        name: 'Monkey With Typewriters',
        id: 101,
        user_id: 101
      }],
      ['create', 'unit_activity', {
        unit_id: 101,
        activity_id: 101,
      }],
      ['create', 'classroom_unit', {
        classroom_id: 101,
        unit_id: 101,
        assigned_student_ids: [102]
      }]
    ])

    cy.login('someone@gmail.com', 'password')
    cy.visit('/')

    cy.contains('My Activities').click()

    cy.contains('Add More Activities To This Pack').click()

    cy.get('input[type="checkbox"]').last().click({ force: true })
    cy.contains('Update Activities').click()

    cy.reload()
    cy.contains('Unadded Activity').should('be.visible')
  })
})
