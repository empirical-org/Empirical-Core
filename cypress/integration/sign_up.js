describe('Sign Up page', function() {
  it('loads', function() {
    cy.visit('//account/new')
  })

  it('shows two options', function() {
    cy.contains('Educator')
    cy.contains('Student')
  })

  describe('clicking on Educator', function() {
    it ('takes you to an educator form', function() {
      cy.contains('Educator').click()

      cy.get('#first_name')
      .type('Franz')
      .should('have.value', 'Franz')

      cy.get('#last_name')
      .type('Kafka')
      .should('have.value', 'Kafka')

      cy.get('#email')
      .type('sadboy@gmail.com')
      .should('have.value', 'sadboy@gmail.com')

      cy.get('#password')
      .type('TheTr1@l')
      .should('have.value', 'TheTr1@l')

    })

  })

})
