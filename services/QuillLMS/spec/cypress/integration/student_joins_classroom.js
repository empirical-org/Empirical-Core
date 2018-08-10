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

    cy.get('input#first_name').type('Jane')
    cy.get('input#last_name').type('Smith')
    cy.get('input#username').type('jsmith')
    cy.get('input#password').type('password')
    cy.get('button').contains('Sign Up').click()

    cy.get('input#class_code').type('fresh-jive')
    cy.contains('Join Your Class').click()

    cy.contains('Cool Class | Edna Krabappel')
  })
});
