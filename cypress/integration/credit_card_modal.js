describe('Credit Card Modal', () => {

  
  describe('when I open the modal without a credit card associated with my account', ()=>{
    before(() =>{
      cy.exec('RAILS_ENV=cypress rake find_or_create_cypress_test_data:find_or_create_teacher_with_expired_teacher_premium', {failOnNonZeroExit: false})
      cy.login('teacher', 'password')
      // beforeEach(() => {
      //   Cypress.Cookies.preserveOnce("_quill_session")
      // })
      cy.visit('/subscriptions')
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
  
  describe.only('when I open the modal with a credit card associated with my account', ()=>{
    before(()=>{
      cy.exec('RAILS_ENV=cypress rake find_or_create_cypress_test_data:find_or_create_teacher_with_subscription_they_purchased_and_stripe_id', {failOnNonZeroExit: false})
      cy.login('teacher', 'password')
      // beforeEach(() => {
      //   Cypress.Cookies.preserveOnce("_quill_session")
      // })
      cy.visit('/subscriptions')
      cy.get(':nth-child(1) > .renew-subscription').click()
    })
    
    it('shows my associated credit card', ()=>{
      cy.get('.enter-credit-card')
    })
  })
  
  




})
