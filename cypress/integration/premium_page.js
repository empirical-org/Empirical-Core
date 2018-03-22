describe('Premium Page', () => {

  describe('suscriptions', ()=>{
    before(() =>{
      cy.exec('RAILS_ENV=cypress rake find_or_create_cypress_test_data:find_or_create_teacher_with_stripe_id', {failOnNonZeroExit: false})
      cy.login('teacher', 'password')
      beforeEach(() => {
        Cypress.Cookies.preserveOnce('_quill_session')
      })
      cy.visit('/premium')
    })

    describe('when I have never had one', ()=>{
      it('loads', ()=>{
        cy.get('#premium-pricing-guide')
      })



      describe('school premium', ()=>{

        it('has a link to you can book me', ()=>{
          cy.get('.pricing-mini > a').should('have.attr', 'href').should('match', /youcanbook/)
        })

        it('has a purchase button that opens a modal when clicked',()=>{
          cy.get('.btn.purple')
          .click().get('.school-premium-modal')
        })

      })

      describe('teacher premium', ()=>{
        it('has a Buy Now button', ()=>{
          cy.get('#purchase-btn').click()
        })

        it('has a Free Trial button that activate a trial when clicked and redirects to the scorebook', ()=>{
          cy.get('.empty-blue').click()
          cy.location().should((loc)=>{
            expect(loc.pathname).to.eq('/teachers/classrooms/scorebook')
          })
          cy.get('.premium-tab > a > .hide-on-mobile').contains('30 Days Left')
        })
      })

    })



    describe('when I have a trial the subscription page', ()=>{
      // keep this below the free trial activation so that we can build our way through the various states
      before(() =>{
        beforeEach(() => {
          Cypress.Cookies.preserveOnce('_quill_session')
        })
        cy.visit('/premium')
      })

      it('loads', ()=>{
        cy.get('#premium-pricing-guide')
      })

      describe('teacher premium', ()=>{
        it('does not have a Free Trial', ()=>{
          cy.get('.empty-blue').should('not.exist')
        })

        it('has a Buy Now button that opens up a modal', ()=>{
          cy.get('#purchase-btn').click()
        })
      })


    })


    // it('has an option to start premium', ()=>{
    //
    // })
    //
    // it('has an option to start a trial', ()=>{
    //
    // })
    //
    // it('has an option to start a trial', ()=>{
    //
    // })


  })






})
