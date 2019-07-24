describe('Teacher invites coteacher', () => {
  before(() => {
    cy.app('clean')
  })

  it('they see the invite in the coteacher section', () => {

    cy.appFactories([
      ['create', 'simple_user', {
        id: 101,
        role: 'teacher',
        password: 'password',
        email: 'someone@gmail.com',
      }],
      ['create', 'simple_classroom', {
        id: 101,
        name: 'American Football'
      }],
      ['create', 'classrooms_teacher', {
        user_id: 101,
        classroom_id: 101,
      }]
    ])
    cy.login('someone@gmail.com', 'password')
    cy.visit('teachers/classrooms')

    cy.get('input#co-teacher-email').type('hello@example.com')
    cy.get('.Select-arrow').click()
    cy.get('#react-select-2--option-0').click()
    cy.get('button').contains('Invite Co-Teacher').click()

    cy.contains('My Co-Teachers').should('be.visible')
    cy.contains('hello@example.com').should('be.visible')
    cy.contains('Pending').should('be.visible')
  })
})
