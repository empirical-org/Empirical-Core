describe('Teacher clicks the "x" next to an activity in unit', () => {
  before(() => {
    cy.app('clean')
  })

  it('they see it removed', () => {
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
      }],
      ['create', 'simple_activity', {
        id: 101,
        name: 'Cool Activity'
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
      }]
    ])

    cy.login('someone@gmail.com', 'password')
    cy.visit('/')

    cy.contains('My Activities').click()
    cy.contains('Cool Activity').should('be.visible')

    cy.get('.delete-classroom-activity').click()

    cy.contains('Cool Activity').should('not.be.visible')
  })
})
