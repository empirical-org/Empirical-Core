describe('Subscription page', function() {
  after(() => {
    cy.logout()
  })

  describe('when I have Quill Basic', ()=>{
    before(function() {
      cy.cleanDatabase()
      cy.factoryBotCreate({
        factory: 'teacher',
        password: 'password',
        username: 'teacher'
      }).then(() => {
        cy.login('teacher', 'password')
        cy.visit('/subscriptions')
      })
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
      cy.cleanDatabase()
      cy.factoryBotCreate({
        factory: 'teacher',
        password: 'password',
        username: 'teacher',
        id: 1
      }).then(() => {
        cy.factoryBotCreate({
          factory: 'subscription',
          account_type: 'School Paid',
          payment_method: 'Credit Card',
          id: 1
        }).then((sub) => {
          console.log('sub', sub.body)
          cy.factoryBotCreate({
            factory: 'user_subscription',
            user_id: 1,
            subscription_id: 1
          })
        })
        cy.login('teacher', 'password')
        cy.visit('/subscriptions')
      })
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

  describe('when I have School Quill Premium that is recurring', ()=>{
    before(() => {
      cy.cleanDatabase()
      cy.factoryBotCreate({
        factory: 'teacher',
        password: 'password',
        username: 'teacher',
        id: 1
      }).then(() => {
        cy.factoryBotCreate({
          factory: 'subscription',
          account_type: 'School Paid',
          id: 1,
          recurring: true
        }).then(() => {
          cy.factoryBotCreate({
            factory: 'user_subscription',
            user_id: 1,
            subscription_id: 1
          })
        })
        cy.login('teacher', 'password')
        cy.visit('/subscriptions')
      })
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

      it('says my next plan is Quill Premium', ()=> {
        cy.get('.current-subscription-information').contains('Next Plan')
        cy.get('.current-subscription-information').contains('School Premium')
      })
    })

    describe('the next plan alert', ()=>{
      it('states that my premium will renew', ()=>{
        cy.get('.next-plan-alert').contains('Your Subscription will be renewed on')
      })
    })

    describe('the premium subscription history', ()=>{
      it('mentions my School Paid subscription', ()=>{
        cy.get('.subscription-history td').contains('School Paid')
      })
    })
  })

  describe('when I have School Quill Premium that is expired', ()=>{
    const level = 'School'
    const premiumType = `${level} Premium`
    before(() => {
      cy.cleanDatabase()
      cy.factoryBotCreate({
        factory: 'teacher',
        password: 'password',
        username: 'teacher',
        id: 1
      }).then(() => {
        cy.factoryBotCreate({
          factory: 'subscription',
          account_type: 'School Paid',
          id: 1,
          expiration: new Date()
        }).then(() => {
          cy.factoryBotCreate({
            factory: 'user_subscription',
            user_id: 1,
            subscription_id: 1
          })
        })
        cy.login('teacher', 'password')
        cy.visit('/subscriptions')
      })
    })
    describe('the top panel', () => {
      it('states my premium type in the h2', ()=> {
        cy.get('.subscription-status h2').contains(premiumType)
      })

      it('mentions that it was expired in the h2', ()=> {
        cy.get('.subscription-status h2').contains('expired')
      })

      describe('the button to renew subscription', ()=> {
        it('exists', ()=> {
          cy.get('.renew-subscription')
        })


        it('opens a modal when clicked', ()=>{
          cy.get('.renew-subscription').click()
          cy.get('.modal-body')
        })

        describe('the modal it opens', ()=> {
          it('has the premium type', function() {
            cy.get('.modal h1').contains(premiumType)
          });

          describe('the cta section', ()=>{
            it('has a link to email a quote that goes to the wuffoo form', function() {
              cy.get('a.q-button').contains('Email Me a Quote').should('have.attr', 'href').should('match', /quill-premium-quote/)
            });

            describe('the button to purchase by credit card', ()=>{
              it('opens the select credit card modal when clicked', function() {
                cy.get('.cta-section > .flex-row > button.q-button').click()
                cy.get('.select-credit-card-modal')
              });

            })
          })

          describe('i can close the modal by', ()=>{
            it('clicking X', function() {
              cy.get('.pull-right').click()
              cy.get('.modal-body').should('not.exist')
            });
          })

        })
      })


      it('has a paragraph stating I am back to Quill basic', () => {
        cy.get('p').contains(`${premiumType} subscription has expired and you are back to Quill Basic.`)
      })
    })

    describe('the subscription information panel', ()=>{

      it('has my subscription status', ()=>{
        cy.get('.current-subscription-information').contains(`${level} Paid`)
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

      it('has a button to renew Renew Subscription', ()=> {
        cy.get('.current-subscription-information').contains('Renew Subscription')
      })
    })

    describe('the next plan alert', ()=>{
      it('should not exist', ()=>{
        cy.get('.next-plan-alert').should('not.exist')
      })
    })

    describe('the premium subscription history', ()=>{
      it('mentions my School Paid subscription', ()=>{
        cy.get('.subscription-history td').contains('School Paid')
      })
    })
  })

  describe('when I have Teacher Quill Premium that is not recurring', ()=>{
    before(() => {
      cy.cleanDatabase()
      cy.factoryBotCreate({
        factory: 'teacher',
        password: 'password',
        username: 'teacher',
        id: 1
      }).then(() => {
        cy.factoryBotCreate({
          factory: 'subscription',
          account_type: 'Teacher Paid',
          id: 1
        }).then(() => {
          cy.factoryBotCreate({
            factory: 'user_subscription',
            user_id: 1,
            subscription_id: 1
          })
        })
        cy.login('teacher', 'password')
        cy.visit('/subscriptions')
      })
    })
    describe('the top panel', () => {
      it('states my premium type in the h2', ()=> {
        cy.get('.subscription-status h2').contains('Teacher Premium')
      })

      it('has a paragraph with the appropriate copy', () => {
        cy.get('p').contains('With Quill Teacher Premium, you will have access to all of Quill’s free reports as well as additional advanced reporting. You will also be able to view and print reports of your students’ progress. Our advanced reports support concept, Common Core, and overall progress analysis. Here’s more informationabout your Teacher Premium features.')
      })
    })

    describe('the subscription information panel', ()=>{

      it('has my subscription status', ()=>{
        cy.get('.current-subscription-information').contains('Teacher Paid')
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
        cy.get('.next-plan-alert').contains('Once your current Teacher Premium subscription expires, you will be downgraded to the Quill Basic subscription.')
      })
    })

    describe('the premium subscription history', ()=>{
      it('mentions my Teacher Paid subscription', ()=>{
        cy.get('.subscription-history td').contains('Teacher Paid')
      })
    })
  })

  describe('when I have Teacher Quill Premium that is recurring', ()=>{
    before(() => {
      cy.cleanDatabase()
      cy.factoryBotCreate({
        factory: 'teacher',
        password: 'password',
        username: 'teacher',
        id: 1
      }).then(() => {
        cy.factoryBotCreate({
          factory: 'subscription',
          account_type: 'Teacher Paid',
          recurring: true,
          id: 1
        }).then(() => {
          cy.factoryBotCreate({
            factory: 'user_subscription',
            user_id: 1,
            subscription_id: 1
          })
        })
        cy.login('teacher', 'password')
        cy.visit('/subscriptions')
      })
    })
    describe('the top panel', () => {
      it('states my premium type in the h2', ()=> {
        cy.get('.subscription-status h2').contains('Teacher Premium')
      })

      it('has a paragraph with the appropriate copy', () => {
        cy.get('p').contains('With Quill Teacher Premium, you will have access to all of Quill’s free reports as well as additional advanced reporting. You will also be able to view and print reports of your students’ progress. Our advanced reports support concept, Common Core, and overall progress analysis. Here’s more informationabout your Teacher Premium features.')
      })
    })

    describe('the subscription information panel', ()=>{

      it('has my subscription status', ()=>{
        cy.get('.current-subscription-information').contains('Teacher Paid')
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

      it('says my next plan is Quill Premium', ()=> {
        cy.get('.current-subscription-information').contains('Next Plan')
        cy.get('.current-subscription-information').contains('Teacher Paid')
      })
    })

    describe('the next plan alert', ()=>{
      it('states that my premium will renew', ()=>{
        cy.get('.next-plan-alert').contains('Your Subscription will be renewed on')
      })
    })

    describe('the premium subscription history', ()=>{
      it('mentions my Teacher Paid subscription', ()=>{
        cy.get('.subscription-history td').contains('Teacher Paid')
      })
    })
  })

  describe('when I have Teacher Quill Premium that is expired', ()=>{
    const level = 'Teacher'
    const premiumType = `${level} Premium`
    before(() => {
      cy.cleanDatabase()
      cy.factoryBotCreate({
        factory: 'teacher',
        password: 'password',
        username: 'teacher',
        id: 1
      }).then(() => {
        cy.factoryBotCreate({
          factory: 'subscription',
          account_type: 'Teacher Paid',
          expiration: new Date(),
          id: 1
        }).then(() => {
          cy.factoryBotCreate({
            factory: 'user_subscription',
            user_id: 1,
            subscription_id: 1
          })
        })
        cy.login('teacher', 'password')
        cy.visit('/subscriptions')
      })
    })
    describe('the top panel', () => {
      it('states my premium type in the h2', ()=> {
        cy.get('.subscription-status h2').contains(premiumType)
      })

      it('mentions that it was expired in the h2', ()=> {
        cy.get('.subscription-status h2').contains('expired')
      })

      describe('the button to renew subscription', ()=> {

        it('opens the credit card modal when I click it', ()=>{
          cy.get('.subscription-status').find('.renew-subscription').click()
          cy.get('.select-credit-card-modal')
        })

        it('i can close credit card modal by clicking X', function() {
          cy.get('.pull-right').click()
          cy.get('.modal-body').should('not.exist')
        });

      })


      it('has a paragraph stating I am back to Quill basic', () => {
        cy.get('p').contains(`${premiumType} subscription has expired and you are back to Quill Basic.`)
      })
    })

    describe('the subscription information panel', ()=>{

      it('has my subscription status', ()=>{
        cy.get('.current-subscription-information').contains(`${level} Paid`)
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

      it('has a button to renew Renew Subscription', ()=> {
        cy.get('.current-subscription-information').contains('Renew Subscription')
      })
    })

    describe('the next plan alert', ()=>{
      it('should not exist', ()=>{
        cy.get('.next-plan-alert').should('not.exist')
      })
    })

    describe('the premium subscription history', ()=>{
      it('mentions my School Paid subscription', ()=>{
        cy.get('.subscription-history td').contains(`${level} Paid`)
      })
    })
  })

  describe('when I am the purchaser of the account', ()=>{
    before(() => {
      cy.cleanDatabase()
      cy.factoryBotCreate({
        factory: 'teacher',
        password: 'password',
        username: 'teacher',
        name: 'Emilia Friedberg',
        id: 1
      }).then(() => {
        cy.factoryBotCreate({
          factory: 'subscription',
          account_type: 'School Paid',
          purchaser_id: 1,
          id: 1
        }).then(() => {
          cy.factoryBotCreate({
            factory: 'user_subscription',
            user_id: 1,
            subscription_id: 1
          })
        })
        cy.login('teacher', 'password')
        cy.visit('/subscriptions')
      })
    })

    it('shows my name', function() {
      cy.get('.flex-row > :nth-child(1) > :nth-child(2) > :nth-child(2)').contains('Emilia Friedberg')
    });
  })

  describe('when I am not the purchaser of the account', ()=>{
    before(() => {
      cy.cleanDatabase()
      cy.factoryBotCreate({
        factory: 'teacher',
        password: 'password',
        username: 'teacher',
        id: 1
      }).then(() => {
        cy.factoryBotCreate({
          factory: 'subscription',
          account_type: 'School Paid',
          id: 1
        }).then(() => {
          cy.factoryBotCreate({
            factory: 'user_subscription',
            user_id: 1,
            subscription_id: 1
          })
        })
        cy.login('teacher', 'password')
        cy.visit('/subscriptions')
      })
    })

    it('does not show my name', function() {
      cy.get('.flex-row > :nth-child(1) > :nth-child(2) > :nth-child(2)').should('be.empty')
    })
  })
})
