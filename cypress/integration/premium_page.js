describe('Premium Page', () => {

  const teacherActivePremiumCopy = 'You have an active subscription and cannot buy premium now. If your subscription is a school subscription, you may buy Premium when it expires. If your subscription is a teacher one, please turn on recurring payments and we will renew it automatically when your subscription ends.'
  const schoolActivePremiumCopy = 'You have an active subscription and cannot buy premium now. You may buy a new Premium subscription when your current subscription expires.'

  const itHasYouCanBookMeLink = () => {
    it('has a link to you can book me', () => {
      cy.get(':nth-child(3) > .pricing-mini > a').should('have.attr', 'href').should('match', /youcanbook/)
    })
  }
  const itLoads = () => {
    it('loads', ()=>{
      cy.get('#premium-pricing-guide')
    })
  }
  const itDoesNotHaveAFreeTrial = () => {
    it('does not have a Free Trial', () => {
      cy.get('.empty-blue').should('not.exist')
    })
  }
  const itHasAPurchaseButtonThatOpensAModalWhenClicked = () => {
    it('has a purchase button that opens a modal when clicked', () => {
      cy.get('.btn.purple')
        .click().get('.school-premium-modal').get('.pull-right').click()
    })
  }

  const activePremiumSubscriptionBehavior = () => {

    describe('it has all the active premium behavior', () => {

      itLoads();

      describe('school premium', () => {

        itHasYouCanBookMeLink()

        it('has a purchase button that triggers an alert mentioning active premium when clicked', () => {
          const stub = cy.stub()
          cy.on('window:alert', stub)
          cy.get('#purchase-btn')
            .click().then(() => {
              expect(stub.getCall(0)).to.be.calledWith(teacherActivePremiumCopy)
            })
        })

      })

      describe('teacher premium', () => {

        itDoesNotHaveAFreeTrial()

        it('has a purchase button that triggers an alert mentioning active premium when clicked', () => {
          const stub = cy.stub()
          cy.on('window:alert', stub)
          cy.get('.btn.purple')
            .click().then(() => {
              expect(stub.getCall(0)).to.be.calledWith(schoolActivePremiumCopy)
            })
        })
      })
    })
  }


  describe('subscriptions', () => {
    describe('when I am not logged in', () => {
      before(() => {
        cy.logout();
        cy.visit('/premium')
      })

      itLoads();

      itHasYouCanBookMeLink()

      describe('school premium', () => {
        it('has a purchase button that triggers an alert when clicked', () => {
          const stub = cy.stub()
          cy.on('window:alert', stub)
          cy.get('.btn.purple')
            .click().then(() => {
              expect(stub.getCall(0)).to.be.calledWith('You must be logged in to activate Premium.')
            })
        })
      })
    })

    describe('when I am logged in', () => {

      before(() => {
        cy.exec('RAILS_ENV=cypress spring rake find_or_create_cypress_test_data:find_or_create_teacher_with_stripe_id', {
          failOnNonZeroExit: false
        })
        cy.login('teacher', 'password')
        beforeEach(() => {
          Cypress.Cookies.preserveOnce('_quill_session')
        })
        cy.visit('/premium')
      })

      describe('when I have never had one', () => {
        itLoads();

        describe('school premium', () => {
          itHasYouCanBookMeLink();
          itHasAPurchaseButtonThatOpensAModalWhenClicked()
        })

        describe('teacher premium', () => {
          it('has a Buy Now button', () => {
            cy.get('#purchase-btn').click()
          })

          it('has a Free Trial button that activate a trial when clicked and redirects to the scorebook', () => {
            cy.get('.empty-blue').click()
            cy.location().should((loc) => {
              expect(loc.pathname).to.eq('/teachers/classrooms/scorebook')
            })
            cy.get('.premium-tab > a > .hide-on-mobile').contains('30 Days Left')
          })
        })

      })



      describe('when I have a trial', () => {
        // keep this below the free trial activation so that we can build our way through the various states
        before(() => {
          beforeEach(() => {
            Cypress.Cookies.preserveOnce('_quill_session')
          })
          cy.visit('/premium')
        })

        itLoads()

        describe('school premium', () => {

          itHasYouCanBookMeLink();

          itHasAPurchaseButtonThatOpensAModalWhenClicked();

        })

        describe('teacher premium', () => {
          before(() => {
            beforeEach(() => {
              Cypress.Cookies.preserveOnce('_quill_session')
            })
            cy.visit('/premium')
          })

          itDoesNotHaveAFreeTrial()

          it('has a Buy Now button that opens up the select credit card modal', () => {
            cy.get('#purchase-btn').click()
            cy.get('.select-credit-card-modal')
            // the remainder is just to give the user premium so we can quickly move to the next state
            cy.get('.extant-card').click()
            cy.get('.button').click()
            cy.get('.premium-confirmation')
            cy.reload()
          })
        })


      })
      describe('when I have a teacher premium', () => {
        // keep this below the trial so that we can build our way through the various states

        before(() => {
          beforeEach(() => {
            Cypress.Cookies.preserveOnce('_quill_session')
          })
          cy.visit('/premium')
        })

        activePremiumSubscriptionBehavior()

      })

      describe('when I have school premium', () => {

        before(() => {
          cy.exec('RAILS_ENV=cypress spring rake find_or_create_cypress_test_data:find_or_create_teacher_with_school_premium', {
            failOnNonZeroExit: false
          })
          cy.login('teacher', 'password')
          cy.visit('/premium')
        })

        activePremiumSubscriptionBehavior()

      })
    })
  })






})
