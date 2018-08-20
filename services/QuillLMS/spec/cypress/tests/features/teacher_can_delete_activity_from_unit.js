describe('Teacher clicks the "x" next to an activity in unit', () => {
  before(() => {
    cy.app('clean')
  })

  it('they see it removed', () => {
    cy.appFactories([
      ['create', 'teacher', 'with_classrooms_students_and_activities', {
        password: 'password',
        email: 'someone@gmail.com'
      }]
    ])
    cy.login('someone@gmail.com', 'password')
    cy.visit('/teachers/classrooms/activity_planner')
  })
})
