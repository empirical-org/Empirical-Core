describe('Navbar', function() {

  before( function() {
    cy.visit('/')
  })

  describe('navbar', function() {
    describe('Learning Tools item', function() {
      it ('should make the tooltip appear on focus', function() {
        cy.get('#learning-tools').click()
        cy.get('#learning-tools').find('.navbar-tooltip').should('be.visible')
      })
      describe('Learning Tools tooltip', function() {
        beforeEach(function() {
          cy.get('#learning-tools').click()
        })
        it('has a link to the Connect tool page', function() {
          cy.get('#learning-tools').contains('Quill Connect').click({force: true})
          cy.url().should('include', 'tools/connect')
        })
        it('has a link to the Lessons tool page', function() {
          cy.get('#learning-tools').contains('Quill Lessons').click({force: true})
          cy.url().should('include', 'tools/lessons')
        })
        it('has a link to the Diagnostic tool page', function() {
          cy.get('#learning-tools').contains('Quill Diagnostic').click({force: true})
          cy.url().should('include', 'tools/diagnostic')
        })
        it('has a link to the Proofreader tool page', function() {
          cy.get('#learning-tools').contains('Quill Proofreader').click({force: true})
          cy.url().should('include', 'tools/proofreader')
        })
        it('has a link to the Grammar tool page', function() {
          cy.get('#learning-tools').contains('Quill Grammar').click({force: true})
          cy.url().should('include', 'tools/grammar')
        })

      })
    })

    describe('Explore Curriculum item', function() {
      it ('should make the tooltip appear on focus', function() {
        cy.get('#explore-curriculum').click()
        cy.get('#explore-curriculum').find('.navbar-tooltip').should('be.visible')
      })
      describe('Explore Curriculum tooltip', function() {
        beforeEach(function() {
          cy.get('#explore-curriculum').click()
        })
        it('has a link to the Featured Activities page', function() {
          cy.get('#explore-curriculum').contains('Featured Activities').click({force: true})
          cy.url().should('include', '/activities/packs')
        })
        it('has a link to the Standards page', function() {
          cy.get('#explore-curriculum').contains('ELA Standards').click({force: true})
          cy.url().should('include', '/activities/section/7')
        })
        it('has a link to the Pedagogy page', function() {
          cy.get('#explore-curriculum').contains('Our Pedagogy')
          // TODO: add link once we have one
        })

      })
    })

    describe('Using Quill item', function() {
      it ('should make the tooltip appear on focus', function() {
        cy.get('#using-quill').click()
        cy.get('#using-quill').find('.navbar-tooltip').should('be.visible')
      })
      describe('Using Quill tooltip', function() {
        beforeEach(function() {
          cy.get('#using-quill').click()
        })
        it('has a link to the All Articles page', function() {
          cy.get('#using-quill').contains('All Articles').click({force: true})
          cy.url().should('include', '/teacher_resources')
        })
        it('has a link to the Getting Started page', function() {
          cy.get('#using-quill').contains('Getting Started').click({force: true})
          cy.url().should('include', '/teacher_resources/topics/getting_started')
        })
        it('has a link to the Case Studies Page page', function() {
          cy.get('#using-quill').contains('Case Studies').click({force: true})
          cy.url().should('include', '/teacher_resources/topics/case_studies')
        })
        it('has a link to the Writing Instruction Research page', function() {
          cy.get('#using-quill').contains('Writing Instruction Research').click({force: true})
          cy.url().should('include', '/teacher_resources/topics/education_research')
        })
        it('has a link to the FAQ page', function() {
          cy.get('#using-quill').contains('FAQ').click({force: true})
          cy.url().should('include', '/faq')
        })
        it('has a link to the premium page', function() {
          cy.get('#using-quill').contains('Premium').click({force: true})
          cy.url().should('include', '/premium')
        })

      })
    })

    it('Login item', function() {
      cy.contains('Login').click()

      cy.url().should('include', 'session/new')
    })

    it('Sign Up item', function() {
      cy.contains('Sign Up').click()

      cy.url().should('include', 'account/new')
    })

  })
  //
  // it('has a link to the tools page', function() {
  //   cy.contains('Tools').click()
  //
  //   cy.url().should('include', 'tools')
  // })
  //
  // it('has a link to the featured activity packs page', function() {
  //   cy.contains('Resources').click()
  //
  //   cy.url().should('include', 'activities/packs')
  // })
  //
  // it('has a link to the mission page', function() {
  //   cy.contains('Our Story').click()
  //
  //   cy.url().should('include', 'mission')
  // })
  //
  // it('has a link to the login page', function() {
  //   cy.contains('Login').click()
  //
  //   cy.url().should('include', 'session/new')
  // })
  //
  // it('has a link to the sign up page', function() {
  //   cy.contains('Sign Up').click()
  //
  //   cy.url().should('include', 'account/new')
  // })

})
