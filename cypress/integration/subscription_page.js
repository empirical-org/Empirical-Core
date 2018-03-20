describe('Subscription page', function() {


  describe('when I have Quill Basic', ()=>{
    before(function() {
      cy.exec('RAILS_ENV=cypress rake find_or_create_cypress_test_data:find_or_create_teacher', {failOnNonZeroExit: false})
      cy.login('teacher', 'password')
      cy.visit('/subscriptions')
    })
    describe('the top panel', () => {
      it('states my premium type in the h2', ()=> {
        cy.get('.subscription-status h2').contains('Quill Basic')
      })

      it('has a link to learn more about premium', ()=> {
        cy.get('.subscription-status a').contains('Learn More About Quill Premium')
      })

      it('has a paragraph with the appropriate copy', () => {
        cy.get('p').contains('Quill Basic provides access to all of Quill\'s content. To access Quill Premium, you can purchase an individual teacher subscription or a school subscription. Teachers can earn free credits for Teacher Premium by sharing Quill and creating content.')
      })
    })

    describe('the subscription information panel', ()=>{

      it('has my subscription status', ()=>{
        cy.get('.current-subscription-information').contains('Quill Basic')
      })

      it('has a link to learn more about premium', ()=> {
        cy.get('.sub-button-row').contains('Learn More About Quill Premium')
      })
    })
  })

  describe('when I have School Quill Premium', ()=>{
    before(()=>{
      cy.exec('RAILS_ENV=cypress rake find_or_create_cypress_test_data:find_or_create_teacher_with_school_premium', {failOnNonZeroExit: false})
      cy.login('teacher', 'password')
      cy.visit('/subscriptions')
    })
    describe('the top panel', () => {
      it('states my premium type in the h2', ()=> {
        cy.get('.subscription-status h2').contains('Quill Basic')
      })

      it('has a link to learn more about premium', ()=> {
        cy.get('.subscription-status a').contains('Learn More About Quill Premium')
      })

      it('has a paragraph with the appropriate copy', () => {
        cy.get('p').contains('Quill Basic provides access to all of Quill\'s content. To access Quill Premium, you can purchase an individual teacher subscription or a school subscription. Teachers can earn free credits for Teacher Premium by sharing Quill and creating content.')
      })
    })

    describe('the subscription information panel', ()=>{

      it('has my subscription status', ()=>{
        cy.get('.current-subscription-information').contains('Quill Basic')
      })

      it('has a link to learn more about premium', ()=> {
        cy.get('.sub-button-row').contains('Learn More About Quill Premium')
      })
    })
  })

  describe('when I have never had a premium subscription', ()=>{
    it('states that they never have', function() {
      cy.get('.subscription-history').contains('You have not yet started a Quill Premium Subscription')
    })
  })

})
