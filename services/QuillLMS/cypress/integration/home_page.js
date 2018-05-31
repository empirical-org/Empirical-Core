describe('Home page', function() {
  beforeEach(function() {
    cy.logout();
  })

  it('loads', function() {
    cy.visit('/')
  })

})
