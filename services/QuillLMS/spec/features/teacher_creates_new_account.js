describe('Teacher creates new account', () => {
  beforeEach(() => {
    cy.cleanDatabase()
  })

  it('they should see the new classroom page', () => {
    cy.factoryBotCreate({
      factory: 'simple_school',
      name: 'Kool School',
      zipcode: 11104,
    })

    cy.visit('/')
    cy.contains('Sign Up').click()
    cy.contains('Educator').click()

    cy.get('input[placeholder="First Name"]').type('Jane')
    cy.get('input[placeholder="Last Name"]').type('Smith')
    cy.get('input[placeholder="Email"]').type('fake@example.com')
    cy.get('input[placeholder="Password"]').type('password')
    cy.get('button').contains('Sign Up').click();

    cy.contains('Yes').click()

    cy.get('input[placeholder="Zip"]').type('11104')

    cy.get('select').select('Kool School')
    cy.contains('Confirm School').click()

    cy.contains('Create Your Class')
  })
});
