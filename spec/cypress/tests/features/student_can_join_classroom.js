describe('Student joins classroom', () => {
  beforeEach(() => {
    cy.app('clean')
  })

  it('they should see their profile', () => {
    cy.appFactories([
      ['create', 'simple_classroom', {
        name: 'Cool Class',
        code: 'fresh-jive',
        id: 101,
      }],
      ['create', 'simple_user', {
        role: 'teacher',
        name: 'Edna Krabappel',
        id: 101,
      }],
      ['create', 'classrooms_teacher', {
        user_id: 101,
        classroom_id: 101,
        role: 'owner',
      }]
    ])

    cy.visit('/')
    cy.contains('Sign Up').click()
    cy.contains('Student').click()

    cy.get('.first-name > input').type('Jane')
    cy.get('.last-name > input').type('Smith')
    cy.get('.username > input').type('jsmith')
    cy.get('.password > input').type('password')
    cy.get('input').contains('Sign up').last().click()

    cy.url().should('include', '/add_classroom')
    cy.get('.input-container > input').type('fresh-jive')
    cy.contains('Join your class').click()

    cy.contains('Cool Class | Edna Krabappel')
  })
});
