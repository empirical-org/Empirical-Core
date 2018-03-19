describe('Navbar', function() {

  before( function() {
    cy.visit('/')
  })

  describe('navbar', function() {
    describe('Learning Tools item', function() {
      it ('should make the tooltip appear on focus', function() {
        cy.get('#learning-tools').click()
        cy.get('.navbar-tooltip').should('be.visible')
      })
      describe('Learning Tools tooltip', function() {
        beforeEach(function() {
          cy.get('#learning-tools').click()
        })
        it('has a link to the Connect tool page', function() {
          cy.contains('Quill Connect').click({force: true})
          cy.url().should('include', 'tools/connect')
        })
        it('has a link to the Lessons tool page', function() {
          cy.contains('Quill Lessons').click({force: true})
          cy.url().should('include', 'tools/lessons')
        })
        it('has a link to the Diagnostic tool page', function() {
          cy.contains('Quill Diagnostic').click({force: true})
          cy.url().should('include', 'tools/diagnostic')
        })
        it('has a link to the Proofreader tool page', function() {
          cy.contains('Quill Proofreader').click({force: true})
          cy.url().should('include', 'tools/proofreader')
        })
        it('has a link to the Grammar tool page', function() {
          cy.contains('Quill Grammar').click({force: true})
          cy.url().should('include', 'tools/grammar')
        })

      })
    })

    describe('Explore Curriculum item', function() {
      it ('should make the tooltip appear on focus', function() {
        cy.get('#explore-curriculum').click()
        cy.get('.navbar-tooltip').should('be.visible')
      })
      describe('Explore Curriculum tooltip', function() {
        beforeEach(function() {
          cy.get('#explore-curriculum').click()
        })
        it('has a link to the Featured Activites page', function() {
          cy.contains('Featured Activites').click()
          cy.url().should('include', '/activities/packs')
        })
        it('has a link to the Standards page', function() {
          cy.contains('ELA Standards').click()
          cy.url().should('include', '/activities/section/7')
        })
        it('has a link to the Pedagogy page', function() {
          cy.contains('Our Pedagogy')
          // TODO: add link once we have one
        })

      })
    })

    describe('Using Quill item', function() {
      it ('should make the tooltip appear on focus', function() {
        cy.get('#using-quill').click()
        cy.get('.navbar-tooltip').should('be.visible')
      })
      describe('Using Quill tooltip', function() {
        beforeEach(function() {
          cy.get('#using-quill').click()
        })
        it('has a link to the All Articles page', function() {
          cy.contains('All Articles').click()
          cy.url().should('include', '/teacher_resources')
        })
        it('has a link to the Getting Started page', function() {
          cy.contains('Getting Started').click()
          cy.url().should('include', '/teacher_resources/topics/getting_started')
        })
        it('has a link to the Case Studies Page page', function() {
          cy.contains('Case Studies').click()
          cy.url().should('include', '/teacher_resources/topics/case_studies')
        })
        it('has a link to the Writing Instruction Research page', function() {
          cy.contains('Writing Instruction Research').click()
          cy.url().should('include', '/teacher_resources/topics/education_research')
        })
        it('has a link to the FAQ page', function() {
          cy.contains('FAQ').click()
          cy.url().should('include', '/faq')
        })
        it('has a link to the FAQ page', function() {
          cy.contains('FAQ').click()
          cy.url().should('include', '/faq')
        })
        it('has a link to the premium page', function() {
          cy.contains('premium').click()
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
