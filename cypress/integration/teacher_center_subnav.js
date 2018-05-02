describe('Teacher Center Navbar', function() {

  before( function() {
    cy.visit('/teacher-center')
  })

  it('has a link to the Featured Activities page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list').contains('All Resources').click({force: true})
    cy.url().should('include', '/teacher-center')
  })

  it('has a link to the Getting Started page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list').contains('Getting Started').click({force: true})
    cy.url().should('include', '/teacher-center/topic/getting-started')
  })

  it('has a link to the Teacher Stories page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list').contains('Teacher Stories').click({force: true})
    cy.url().should('include', '/teacher-center/topic/teacher-stories')
  })

  it('has a link to the Writing Instruction Research page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list').contains('Writing Instruction Research').click({force: true})
    cy.url().should('include', '/teacher-center/topic/writing-instruction-research')
  })

  it('has a link to the FAQ page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list').contains('FAQ').click({force: true})
    cy.url().should('include', '/faq')
  })

  it('has a link to the Premium page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list').contains('Premium').click({force: true})
    cy.url().should('include', '/premium')
  })

})
