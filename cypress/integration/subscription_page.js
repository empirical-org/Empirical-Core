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

    describe('when I have never had a premium subscription', ()=>{
      it('states that they never have', function() {
        cy.get('.subscription-history').contains('You have not yet started a Quill Premium Subscription')
      })
    })
  })

  describe('when I have School Quill Premium that is not recurring', ()=>{
    before(()=>{
      cy.exec('RAILS_ENV=cypress rake find_or_create_cypress_test_data:find_or_create_teacher_with_school_premium', {failOnNonZeroExit: false})
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

  describe('when I have School Quill Premium that is recurring', ()=>{
    before(()=>{
      cy.exec('RAILS_ENV=cypress rake find_or_create_cypress_test_data:find_or_create_teacher_with_recurring_school_premium', {failOnNonZeroExit: false})
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

  describe('when I have Teacher Quill Premium that is not recurring', ()=>{
    before(()=>{
      cy.exec('RAILS_ENV=cypress rake find_or_create_cypress_test_data:find_or_create_teacher_with_teacher_premium', {failOnNonZeroExit: false})
      cy.login('teacher', 'password')
      cy.visit('/subscriptions')
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
    before(()=>{
      cy.exec('RAILS_ENV=cypress rake find_or_create_cypress_test_data:find_or_create_teacher_with_recurring_teacher_premium', {failOnNonZeroExit: false})
      cy.login('teacher', 'password')
      cy.visit('/subscriptions')
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

  // describe.only('when I have School Quill Premium that is recurring and will expire in less than a month', ()=>{
  //   before(()=>{
  //     cy.exec('RAILS_ENV=cypress rake find_or_create_cypress_test_data:find_or_create_teacher_with_expiring_school_premium', {failOnNonZeroExit: false})
  //     cy.login('teacher', 'password')
  //     cy.visit('/subscriptions')
  //   })
  //   describe('the top panel', () => {
  //     it('states my premium type in the h2', ()=> {
  //       cy.get('.subscription-status h2').contains('School Premium')
  //     })
  //
  //     it('has a paragraph with the appropriate copy', () => {
  //       cy.get('p').contains('With Quill School Premium, you will have access to all of Quill’s free reports as well as additional advanced reporting. You will also be able to view and print reports of your students’ progress. Our advanced reports support concept, Common Core, and overall progress analysis. Here’s more information about your School Premium features.')
  //     })
  //   })
  //
  //   describe('the subscription information panel', ()=>{
  //
  //     it('has my subscription status', ()=>{
  //       cy.get('.current-subscription-information').contains('School Paid')
  //     })
  //
  //     it('defaults to a school invoice if there is no payment method', ()=> {
  //       cy.get('.current-subscription-information').contains('School Invoice')
  //     })
  //
  //     it('has a row for a purchaser', ()=> {
  //       cy.get('.current-subscription-information').contains('Purchaser')
  //     })
  //
  //     it('has a row for a next subscription', ()=> {
  //       cy.get('.current-subscription-information').contains('NEXT SUBSCRIPTION')
  //     })
  //
  //     it('says my next plan is Quill Premium', ()=> {
  //       cy.get('.current-subscription-information').contains('Next Plan')
  //       cy.get('.current-subscription-information').contains('School Premium')
  //     })
  //   })
  //
  //   describe('the next plan alert', ()=>{
  //     it('states that my premium will renew', ()=>{
  //       cy.get('.next-plan-alert').contains('Your Subscription will be renewed on')
  //     })
  //   })
  //
  //   describe('the premium subscription history', ()=>{
  //     it('mentions my School Paid subscription', ()=>{
  //       cy.get('.subscription-history td').contains('School Paid')
  //     })
  //   })
  // })



})
