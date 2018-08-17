describe('Teacher creates new account', () => {
  beforeEach(() => {
    cy.app('clean')
  })

  it('they should see the new classroom page', () => {
    cy.appFactories([
      ['create', 'simple_school', { name: 'Kool School', zipcode: 11104, }]
    ])

    cy.visit('/')
    cy.contains('Sign Up').click()
    cy.contains('Educator').click()

    cy.get('input#first_name').type('Jane')
    cy.get('input#last_name').type('Smith')
    cy.get('input#email').type('fake@example.com')
    cy.get('input#password').type('password')
    cy.get('button').contains('Sign Up').click();

    cy.contains('Yes').click()

    cy.get('input#zip').type('11104')

    cy.get('select').select('Kool School')
    cy.contains('Confirm School').click()

    cy.contains('Create Your Class')
  })
});
