const faker = require('faker');

const showsClassrooms = () => cy.get('tbody > :nth-child(1) > :nth-child(1)')

const itShowsMeMyClassrooms= () => {
  it('shows me my classrooms', ()=>{
    showsClassrooms()
  })
}

describe('Manage Classrooms', function() {

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


  describe('when I have no classrooms', ()=>{
    it('redirects me to the new classroom page', ()=>{
      cy.url().should('contain', 'teachers/classrooms/new')
    })
  })

  describe('when I have classrooms', ()=>{
    describe('that I coteach', ()=>{
      before( function() {
        cy.logout()
        cy.cleanDatabase()
        cy.factoryBotCreate({
          factory: 'co_teacher_with_one_classroom',
          password: 'password',
          email: 'someone@gmail.com'
        }).then(() => {
          cy.login('someone@gmail.com', 'password')
          cy.visit('teachers/classrooms')
        })
      })

      itShowsMeMyClassrooms()

      describe('the option to leave a classroom', ()=> {
        it('removes my active classrooms when clicked', ()=> {
          cy.get('#active-classes tbody tr td').last().children().last().click()
          cy.get('#active-classes').should('not.exist')
        })
      })
    })

    describe('no matter what', ()=>{
      it('has a link to create a class', ()=> {
        cy.get('.cta-box > [href="/teachers/classrooms/new"]')
      })
      it('has a link to sync with google', ()=> {
        cy.get('[href="/teachers/classrooms/google_sync"]')
      })
    })

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

      it('has a link to edit students in the classroom row', ()=>{
        cy.get('.manage-class').first().should('have.attr', 'href').and('contain', 'students')
      })

      itShowsMeMyClassrooms()

      describe('the active classroom section', ()=> {
        it('exists', ()=> {
          showsClassrooms()
        })

        it('does not show me a notification if I have any active classrooms', ()=> {
          cy.get('.notification_box').should('not.exist')
        })

      })

      describe('the coteacher section', ()=> {
        it('exists', ()=> {
          cy.get('#invite-coteachers')
        })

        it('contains a list of my classrooms', ()=>{
          cy.get('.Select-arrow-zone').click()
        })
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
            cy.get('.notification-box').should('contain', 'You’ve archived all your classes!')
          })
        })

      })



    })

  })
})
