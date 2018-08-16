describe('Subscription page', function() {
  after(() => {
    cy.logout()
  })

  describe('when I have Quill Basic', ()=>{
    before(function() {
      cy.app('clean')
      cy.appFactories([
        ['create', 'teacher', {
          password: 'password',
          username: 'teacher'
        }],
      ])
      cy.login('teacher', 'password')
      cy.visit('/subscriptions')
      beforeEach(() => {
        Cypress.Cookies.preserveOnce('_quill_session')
      })
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

    describe('when I have never had a premium subscription', ()=>{
      it('states that they never have', function() {
        cy.get('.subscription-history').contains('You have not yet started a Quill Premium Subscription')
      })
    })
  })

  describe('when I have School Quill Premium that is not recurring', ()=>{
    before(() => {
      cy.app('clean')
      const expiration = new Date();
      expiration.setDate(expiration.getDate() + 95);

      cy.appFactories([
        ['create', 'teacher', {
          password: 'password',
          username: 'teacher',
          id: 1
        }],
        ['create', 'subscription', {
          account_type: 'School Paid',
          expiration,
          id: 1
        }],
        ['create', 'user_subscription', {
          user_id: 1,
          subscription_id: 1
        }]
      ])
      cy.login('teacher', 'password')
      cy.visit('/subscriptions')
    })
    describe('the top panel', () => {
      it('states my premium type in the h2', ()=> {
        cy.get('.subscription-status h2').contains('School Premium')
      })

      it('has a paragraph with the appropriate copy', () => {
        cy.get('p').contains('With Quill School Premium, you will have access to all of Quill’s free reports as well as additional advanced reporting. You will also be able to view and print reports of your students’ progress. Our advanced reports support concept, Common Core, and overall progress analysis. Here’s more information about your School Premium features.')
      })
    })

    describe('the subscription information panel', ()=>{

      it('has my subscription status', ()=>{
        cy.get('.current-subscription-information').contains('School Paid')
      })

      it('defaults to a school invoice if there is no payment method', ()=> {
        cy.get('.current-subscription-information').contains('School Invoice')
      })

      it('has a row for a purchaser', ()=> {
        cy.get('.current-subscription-information').contains('Purchaser')
      })

      it('has a row for a next subscription', ()=> {
        cy.get('.current-subscription-information').contains('NEXT SUBSCRIPTION')
      })

      it('says my next plan is Quill Basic', ()=> {
        cy.get('.current-subscription-information').contains('Next Plan')
        cy.get('.current-subscription-information').contains('Quill Basic')
      })
    })

    describe('the next plan alert', ()=>{
      it('states that I will be downgraded', ()=>{
        cy.get('.next-plan-alert').contains('Once your current School Premium subscription expires, you will be downgraded to the Quill Basic subscription.')
      })
    })

    describe('the premium subscription history', ()=>{
      it('mentions my School Paid subscription', ()=>{
        cy.get('.subscription-history td').contains('School Paid')
      })
    })
  })
})
