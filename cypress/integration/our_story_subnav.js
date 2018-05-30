describe('Our Story Navbar', function() {

  before( function() {
    cy.visit('/mission')
  })

  it('has a link to the About Us page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list').contains('About Us').click({force: true})
    cy.url().should('include', '/mission')
  })

  it('has a link to the Impact page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list').contains('Impact').click({force: true})
    cy.url().should('include', '/impact')
  })

  it('has a link to the Announcements page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list').contains('Announcements').click({force: true})
    cy.url().should('include', '/announcements')
  })

  it('has a link to the In the Press page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list').contains('In the Press').click({force: true})
    cy.url().should('include', '/press')
  })

  it('has a link to the Team page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list').contains('Team').click({force: true})
    cy.url().should('include', '/team')
  })

  it('has a link to the Donate page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list').contains('Donate').should('have.attr', 'href').should('match', /donate/)
  })

})
