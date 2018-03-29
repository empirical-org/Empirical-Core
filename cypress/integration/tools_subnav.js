describe('Tools Page Navbar', function() {

  before( function() {
    cy.visit('/tools/connect')
  })
  it('has a link to the Connect tool page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list > #connect').contains('Quill Connect').click({force: true})
    cy.url().should('include', 'tools/connect')
  })
  it('has a link to the Lessons tool page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list > #lessons').contains('Quill Lessons').click({force: true})
    cy.url().should('include', 'tools/lessons')
  })
  it('has a link to the Diagnostic tool page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list > #diagnostic').contains('Quill Diagnostic').click({force: true})
    cy.url().should('include', 'tools/diagnostic')
  })
  it('has a link to the Proofreader tool page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list > #proofreader').contains('Quill Proofreader').click({force: true})
    cy.url().should('include', 'tools/proofreader')
  })
  it('has a link to the Grammar tool page', function() {
    cy.get('.q-nav-bar > .desktop-nav-list > #grammar').contains('Quill Grammar').click({force: true})
    cy.url().should('include', 'tools/grammar')
  })

})
