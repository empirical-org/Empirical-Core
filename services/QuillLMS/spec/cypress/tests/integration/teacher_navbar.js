describe('Teacher Navbar', function() {
  before(function() {
    cy.app('clean')
    cy.appFactories([
      ['create', 'teacher_with_one_classroom', {
        password: 'password',
        username: 'teacher',
      }]
    ])
    cy.login('teacher', 'password')
    cy.visit('/')
  })

  after(() => {
    cy.logout()
  })

  beforeEach(function() {
    Cypress.Cookies.preserveOnce("_quill_session")
  })

  describe('Teacher Center item', function() {
    it ('should make the tooltip appear on focus', function() {
      cy.get('#teacher-center').focus()
      // cy.get('#teacher-center > .navbar-tooltip').should('be.visible')
    })
    describe('Teacher Center tooltip', function() {
      beforeEach(function() {
        cy.get('#teacher-center').focus()
      })
      it('has a link to the All Resources page', function() {
        cy.get('#teacher-center').contains('All Resources').click({force: true})
        cy.url().should('include', '/teacher-center')
      })
      it('has a link to the Getting Started page', function() {
        cy.get('#teacher-center').contains('Getting Started').click({force: true})
        cy.url().should('include', '/teacher-center/topic/getting-started')
      })
      it('has a link to the Teacher Stories Page page', function() {
        cy.get('#teacher-center').contains('Teacher Stories').click({force: true})
        cy.url().should('include', '/teacher-center/topic/teacher-stories')
      })
      it('has a link to the Writing Instruction Research page', function() {
        cy.get('#teacher-center').contains('Writing Instruction Research').click({force: true})
        cy.url().should('include', '/teacher-center/topic/writing-instruction-research')
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
      cy.get('#quill-support').focus()
      // cy.get('#quill-support > .navbar-tooltip').should('be.visible')
    })
    describe('Quill Support tooltip', function() {
      beforeEach(function() {
        cy.get('#quill-support').focus()
      })
      it('has a link to the General Questions page', function() {
        cy.get('#quill-support').contains('General Questions').should('have.attr', 'href').should('match', /general-questions/)
      })
      it('has a link to the Using Quill\'s Tools page', function() {
        cy.get('#quill-support').contains('Using Quill\'s Tools').should('have.attr', 'href').should('match', /using-quill-tools/)
      })
      it('has a link to the Data and Reporting page', function() {
        cy.get('#quill-support').contains('Data and Reporting').should('have.attr', 'href').should('match', /data-and-reporting/)
      })
      it('has a link to the Research and Pedagogy page', function() {
        cy.get('#quill-support').contains('Research and Pedagogy').should('have.attr', 'href').should('match', /research-and-pedagogy/)
      })
      it('has a link to the Technical Questions page', function() {
        cy.get('#quill-support').contains('Technical Questions').should('have.attr', 'href').should('match', /technical-questions/)
      })

    })
  })

  describe('Learning Tools item', function() {
    it ('should make the tooltip appear on focus', function() {
      cy.get('#learning-tools').focus()
      // cy.get('#learning-tools > .navbar-tooltip').should('be.visible')
    })
    describe('Learning Tools tooltip', function() {
      beforeEach(function() {
        cy.get('#learning-tools').focus()
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

})
