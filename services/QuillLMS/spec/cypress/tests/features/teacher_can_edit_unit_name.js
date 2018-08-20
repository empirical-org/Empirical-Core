describe('Teacher changes the name of an existing unit', () => {
  before(() => {
    cy.app('clean')
  })

  it('they see the change persisted', () => {
    cy.appFactories([
      ['create', 'teacher', 'with_classrooms_students_and_activities', {
        password: 'password',
        email: 'someone@gmail.com'
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
