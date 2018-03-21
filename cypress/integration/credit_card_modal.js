describe('Credit Card Modal', () => {

  before(() => {
    cy.exec('RAILS_ENV=cypress rake find_or_create_cypress_test_data:find_or_create_teacher_with_expired_teacher_premium', {failOnNonZeroExit: false})
    cy.login('teacher', 'password')
    // beforeEach(() => {
    //   Cypress.Cookies.preserveOnce("_quill_session")
    // })
    cy.visit('/subscriptions')
  })
  
  describe('when I open the modal without a credit card associated with my account', ()=>{
    before(() =>{
      cy.get(':nth-child(1) > .renew-subscription').click()
    })
    
    it('loads', ()=>{
      cy.get('.select-credit-card-modal')
    })
    
    describe('the option to enter a credit card', ()=> {
      it('opens the stripe modal when clicked', ()=>{
        cy.get('.enter-credit-card').click()
      })
    })
    
  })
  
  // TODO: stub the flow when a user has a stripe account
  




})
