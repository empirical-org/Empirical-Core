describe('Factories', () => {
  it('allows creation of test data using FactoryBot', () => {
    cy.cleanDatabase()
    cy.factoryBotCreate({
      factory: 'teacher',
      traits: ['has_a_stripe_customer_id', 'signed_up_with_google'],
      name:    'Tommy Conroy',
    }).then((response) => {
      console.log(response.body);
      expect(response.body.name).to.eq('Tommy Conroy')
    })
  })
})
