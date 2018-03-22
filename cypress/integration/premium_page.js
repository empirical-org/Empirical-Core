describe('Premium Page', () => {

  describe('when I have never had a subscription', ()=>{
    before(() =>{
      cy.exec('RAILS_ENV=cypress rake find_or_create_cypress_test_data:find_or_create_teacher', {failOnNonZeroExit: false})
      cy.login('teacher', 'password')
      // beforeEach(() => {
      //   Cypress.Cookies.preserveOnce("_quill_session")
      // })
      cy.visit('/premium')
    })

    it('loads', ()=>{
      cy.get('#premium-pricing-guide')
    })

    describe('teacher premium', ()=>{
      describe('buy now button', ()=>{
        it.skip('gives the user premium when clicked', ()=>{
          cy.get('#purchase-btn')
          // .click()
        })
      })

      it('has a Free Trial button', ()=>{
        cy.get('.empty-blue')
      })
    })

    describe('school premium', ()=>{
      it('has a purchase button that opens a modal when clicked',()=>{
        cy.get('.btn.purple')
        .click().get('.school-premium-modal')
      })
    })


    it('has an option to start premium', ()=>{

    })

    it('has an option to start a trial', ()=>{

    })

    it('has an option to start a trial', ()=>{

    })


  })






})
