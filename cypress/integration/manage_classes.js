const faker = require('faker');

const showsClassrooms = () => cy.get('tbody > :nth-child(1) > :nth-child(1)')

describe.only('Manage Classrooms', function() {

  before( function() {
    cy.cleanDatabase()
    cy.factoryBotCreate({
      factory: 'teacher',
      password: 'password',
      email: 'someone@gmail.com'
    }).then(() => {
      cy.login('someone@gmail.com', 'password')
      cy.visit('teachers/classrooms')
    })
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('_quill_session')
  })


  // after(()=>cy.cleanDatabase())

  describe('when I have no classrooms', ()=>{
    it('redirects me to the new classroom page', ()=>{
      cy.url().should('contain', 'teachers/classrooms/new')
    })
  })

  describe('when I have classrooms', ()=>{
    describe('that I own', ()=>{
      before( function() {
        cy.logout()
        cy.cleanDatabase()
        cy.factoryBotCreate({
          factory: 'teacher',
          password: 'password',
          traits: ['with_classrooms_students_and_activities'],
          email: 'someone@gmail.com'
        }).then(() => {
          cy.login('someone@gmail.com', 'password')
          cy.visit('teachers/classrooms')
        })
      })

      it('shows me my classrooms', ()=>{
        showsClassrooms()
      })

      describe('archived classrooms section', ()=>{
        it('does not exist if I have no archived classrooms', ()=>{
          cy.get('#inactive-classes').should('not.exist')
        })

        it('does exist if I have an archived classroom', ()=>{
          cy.get('#active-classes tbody tr td').last().children().last().click()
          cy.get('#inactive-classes')
        })

        it('unarchives classes when I click unarchive', ()=>{
          cy.get('#inactive-classes tbody').find('tr').should('have.length', 1)
          cy.get('#inactive-classes tbody tr td').last().children().last().click()
          cy.get('#inactive-classes').should('not.exist')
        })

        it('grows each time I archive a classroom', ()=>{
          cy.get('#inactive-classes').should('not.exist')
          cy.get('#active-classes tbody tr td').last().children().last().click()
          cy.get('#inactive-classes tbody').find('tr').should('have.length', 1)
          cy.get('#active-classes tbody tr td').last().children().last().click()
          cy.get('#inactive-classes tbody').find('tr').should('have.length', 2)
        })

        describe('when all my classes are archived', ()=>{
          it('does not show me any active classes', ()=>{
            cy.get('#active-classes').should('not.exist')
          })

          it('shows me a notification box with a warning', ()=>{
            cy.get('.notifcation-box').should('contain', 'You’ve archived all your classes!')
          })
        })


      })

    })

  })
})
