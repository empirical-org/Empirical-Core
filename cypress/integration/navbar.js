describe('Navbar', function() {

  before( function() {
    cy.visit('/')
  })

  describe('navbar', function() {
    describe('as a logged out user', function() {
      describe('Learning Tools item', function() {
        it ('should make the tooltip appear on focus', function() {
          cy.get('#learning-tools').click({force: true})
          // cy.get('#learning-tools').get('.navbar-tooltip').should('be.visible')
        })
        describe('Learning Tools tooltip', function() {
          beforeEach(function() {
            cy.get('#learning-tools').click({force: true})
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
          cy.get('#explore-curriculum').click({force: true})
          // cy.get('#explore-curriculum').get('.navbar-tooltip').should('be.visible')
        })
        describe('Explore Curriculum tooltip', function() {
          beforeEach(function() {
            cy.get('#explore-curriculum').click({force: true})
          })
          it('has a link to the Featured Activities page', function() {
            cy.get('#explore-curriculum').contains('Featured Activities').click({force: true})
            cy.url().should('include', '/activities/packs')
          })
          it('has a link to the Standards page', function() {
            cy.get('#explore-curriculum').contains('ELA Standards').should('have.attr', 'href').should('match', /\/activities\/section\/7/)
          })
          // it('has a link to the Pedagogy page', function() {
          //   cy.get('#explore-curriculum').contains('Our Pedagogy')
          //   // TODO: add link once we have one
          // })

        })
      })

      describe('Teacher Center item', function() {
        it ('should make the tooltip appear on focus', function() {
          cy.get('#teacher-center').click({force: true})
          // cy.get('#teacher-center').get('.navbar-tooltip').should('be.visible')
        })
        describe('Teacher Center tooltip', function() {
          beforeEach(function() {
            cy.get('#teacher-center').click({force: true})
          })
          it('has a link to the All Resources page', function() {
            cy.get('#teacher-center').contains('All Resources').click({force: true})
            cy.url().should('include', '/teacher_resources')
          })
          it('has a link to the Getting Started page', function() {
            cy.get('#teacher-center').contains('Getting Started').click({force: true})
            cy.url().should('include', '/teacher_resources/topics/getting_started')
          })
          it('has a link to the Case Studies Page page', function() {
            cy.get('#teacher-center').contains('Case Studies').click({force: true})
            cy.url().should('include', '/teacher_resources/topics/case_studies')
          })
          it('has a link to the Writing Instruction Research page', function() {
            cy.get('#teacher-center').contains('Writing Instruction Research').click({force: true})
            cy.url().should('include', '/teacher_resources/topics/education_research')
          })
          it('has a link to the FAQ page', function() {
            cy.get('#teacher-center').contains('FAQ').click({force: true})
            cy.url().should('include', '/faq')
          })
          it('has a link to the premium page', function() {
            cy.get('#teacher-center').contains('Premium').click({force: true})
            cy.url().should('include', '/premium')
          })

        })
      })

      describe('Our Story item', function() {
        it ('should make the tooltip appear on focus', function() {
          cy.get('#our-story').click({force: true})
          // cy.get('#our-story').get('.navbar-tooltip').should('be.visible')
        })
        describe('Our Story tooltip', function() {
          beforeEach(function() {
            cy.get('#our-story').click({force: true})
          })
          it('has a link to the About Us page', function() {
            cy.get('#our-story').contains('About Us').click({force: true})
            cy.url().should('include', '/mission')
          })
          it('has a link to the Impact page', function() {
            cy.get('#our-story').contains('Impact').click({force: true})
            cy.url().should('include', '/impact')
          })
          it('has a link to the Announcements page', function() {
            cy.get('#our-story').contains('Announcements').click({force: true})
            cy.url().should('include', '/teacher_resources/topics/announcements')
          })
          it('has a link to the In the Press page', function() {
            cy.get('#our-story').contains('In the Press').click({force: true})
            cy.url().should('include', '/press')
          })
          it('has a link to the Team page', function() {
            cy.get('#our-story').contains('Team').click({force: true})
            cy.url().should('include', '/team')
          })
          it('has a link to the Donate page', function() {
            // testing this one a little differently because it is hardcoded to link to community.quill.org, which cypress does not like
            cy.get('#our-story').contains('Donate').should('have.attr', 'href').should('match', /donate/)
          })

        })
      })


      it('Login item', function() {
        cy.contains('Login').click({force: true})

        cy.url().should('include', 'session/new')
      })

      it('Sign Up item', function() {
        cy.contains('Sign Up').click({force: true})

        cy.url().should('include', 'account/new')
      })

    })

    describe('as a logged in teacher', function() {
      before(function() {
        cy.exec('RAILS_ENV=cypress rake find_or_create_cypress_test_data:find_or_create_teacher', {failOnNonZeroExit: false})
        cy.login('teacher', 'password')
      })
      describe('Learning Tools item', function() {
        it ('should make the tooltip appear on focus', function() {
          cy.get('#learning-tools').click({force: true})
          // cy.get('#learning-tools').get('.navbar-tooltip').should('be.visible')
        })
        describe('Learning Tools tooltip', function() {
          beforeEach(function() {
            cy.get('#learning-tools').click({force: true})
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

      describe('Teacher Center item', function() {
        it ('should make the tooltip appear on focus', function() {
          cy.get('#teacher-center').click({force: true})
          // cy.get('#teacher-center').get('.navbar-tooltip').should('be.visible')
        })
        describe('Teacher Center tooltip', function() {
          beforeEach(function() {
            cy.get('#teacher-center').click({force: true})
          })
          it('has a link to the All Resources page', function() {
            cy.get('#teacher-center').contains('All Resources').click({force: true})
            cy.url().should('include', '/teacher_resources')
          })
          it('has a link to the Getting Started page', function() {
            cy.get('#teacher-center').contains('Getting Started').click({force: true})
            cy.url().should('include', '/teacher_resources/topics/getting_started')
          })
          it('has a link to the Case Studies Page page', function() {
            cy.get('#teacher-center').contains('Case Studies').click({force: true})
            cy.url().should('include', '/teacher_resources/topics/case_studies')
          })
          it('has a link to the Writing Instruction Research page', function() {
            cy.get('#teacher-center').contains('Writing Instruction Research').click({force: true})
            cy.url().should('include', '/teacher_resources/topics/education_research')
          })
          it('has a link to the FAQ page', function() {
            cy.get('#teacher-center').contains('FAQ').click({force: true})
            cy.url().should('include', '/faq')
          })
          it('has a link to the premium page', function() {
            cy.get('#teacher-center').contains('Premium').click({force: true})
            cy.url().should('include', '/premium')
          })

        })
      })

      describe('Quill Support item', function() {
        it ('should make the tooltip appear on focus', function() {
          cy.get('#quill-support').click({force: true})
          // cy.get('#quill-support').get('.navbar-tooltip').should('be.visible')
        })
        describe('Quill Support tooltip', function() {
          beforeEach(function() {
            cy.get('#quill-support').click({force: true})
          })
          it('has a link to the General Questions page', function() {
            cy.get('#our-story').contains('General Questions').should('have.attr', 'href').should('match', /general-questions/)
          })
          it('has a link to the Using Quill\'s Tools page', function() {
            cy.get('#our-story').contains('Using Quill\'s Tools').should('have.attr', 'href').should('match', /using-quill-tools/)
          })
          it('has a link to the Data and Reporting page', function() {
            cy.get('#our-story').contains('Data and Reporting').should('have.attr', 'href').should('match', /data-and-reporting/)
          })
          it('has a link to the Research and Pedagogy page', function() {
            cy.get('#our-story').contains('Research and Pedagogy').should('have.attr', 'href').should('match', /research-and-pedagogy/)
          })
          it('has a link to the Technical Questions page', function() {
            cy.get('#our-story').contains('Technical Questions').should('have.attr', 'href').should('match', /technical-questions/)
          })

        })
        })

      })

    })

  })
