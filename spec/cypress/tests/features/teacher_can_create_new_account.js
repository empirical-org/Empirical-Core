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
    cy.get('.cards > :nth-child(2)').click()

    cy.get('.first-name > input').type('Jane')
    cy.get('.last-name > input').type('Smith')
    cy.get('.email > input').type('fake@example.com')
    cy.get('.password > input').type('password')
    cy.get('input').contains('Sign up').click();

    cy.url().should('include', 'k12')

    cy.get('.input-container > input').type('11104')

    cy.contains('Kool School').click()

    cy.contains('Create Your Class')
  })
});
