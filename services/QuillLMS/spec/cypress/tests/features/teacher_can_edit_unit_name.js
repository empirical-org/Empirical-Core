describe('Teacher changes the name of an existing unit', () => {
  before(() => {
    cy.app('clean')
  })

  it('they see the change persisted', () => {
    cy.appFactories([
      ['create', 'simple_user', {
        id: 101,
        role: 'teacher',
        password: 'password',
        email: 'someone@gmail.com'
      }],
      ['create', 'simple_activity', {
        id: 101,
        name: 'Cool Activity',
      }],
      ['create', 'simple_unit', {
        id: 101,
        name: 'Cool Unit',
        user_id: 101,
      }],
      ['create', 'unit_activity', {
        unit_id: 101,
        activity_id: 101,
      }],
      ['create', 'simple_classroom', { id: 101 }],
      ['create', 'classrooms_teacher', {
        classroom_id: 101,
        user_id: 101,
      }],
      ['create', 'classroom_unit', {
        classroom_id: 101,
        unit_id: 101
      }]
    ])
    cy.login('someone@gmail.com', 'password')
    cy.visit('/teachers/classrooms/activity_planner')

    cy.contains('Edit Name').first().click()
    cy.get('input[type="text"]').first().clear().type('Is An Absolute Unit')
    cy.contains('Submit').first().click()

    cy.get('span').contains('Is An Absolute Unit').should('be.visible')
  })
})
