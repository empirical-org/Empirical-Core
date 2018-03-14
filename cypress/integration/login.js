describe('Login page', function() {
  it('loads', function() {
    cy.visit('//session/new')
  })

  it('logs me in', function() {

    cy.get('input[name="user[email]"]')
    .type('emilia@quill.org')
    .should('have.value', 'emilia@quill.org')

    cy.get('input[name="user[password]"]')
    .type(`Emilia29{enter}`)
    // .should('have.value', `Emilia29`)

    // cy.contains('Login').click()
    cy.url().should('include', 'profile')

  })


})
