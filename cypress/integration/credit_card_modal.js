describe('Credit Card Modal', () => {


  describe('when I open the modal without a credit card associated with my account', ()=>{
    before(() =>{
      cy.exec('RAILS_ENV=cypress spring rake find_or_create_cypress_test_data:find_or_create_teacher', {failOnNonZeroExit: false})
      cy.login('teacher', 'password')
      cy.visit('/premium')
      cy.get('#purchase-btn').click()
    })

    it('loads', ()=>{
      cy.get('.select-credit-card-modal')
    })

    describe('the option to enter a credit card', ()=> {
      it('opens the stripe modal when clicked', ()=>{
        cy.get('#purchase-btn').click()
      })
    })

  })

  describe('when I open the modal with a credit card associated with my account', ()=>{
    before(()=>{
      cy.exec('RAILS_ENV=cypress spring rake find_or_create_cypress_test_data:find_or_create_teacher_with_stripe_id', {failOnNonZeroExit: false})
      cy.login('teacher', 'password')
      beforeEach(() => {
        Cypress.Cookies.preserveOnce('_quill_session')
      })
      cy.visit('/premium')
      cy.get('#purchase-btn').click()
    })

    it('and click my associated credit card it gives me the option to buy now', ()=>{
      cy.get('.extant-card').click()
      cy.get('.button').contains('Buy Now')
    })

    it('gives me a premium confirmation if I click buy now', ()=>{
      cy.get('.button').click()
      cy.get('.premium-confirmation')
    })
    
  })






})
