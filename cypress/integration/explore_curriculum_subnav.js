describe('Explore Curriculum Navbar', function() {

  before( function() {
    cy.visit('/activities/packs')
  })
  it('has a link to the Featured Activities page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list').contains('Featured Activities').click({force: true})
    cy.url().should('include', '/activities/packs')
  })
  it('has a link to the ELA Standards page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list').contains('ELA Standards').should('have.attr', 'href').should('match', /\/activities\/section\/7/)
  })

})
