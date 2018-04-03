const faker = require('faker');

const selectGradeFromDropdown = ()=> {
  cy.get('#select-grade').click()
  cy.get('.dropdown-menu > :nth-child(5) > a').click()
}

const className = faker.name.jobArea() + ' ' + faker.name.jobTitle()

const fillInName = (name)=>{
  cy.get('#class-name')
    .type(className || name)
}

describe.only('Create Classroom', function() {

  before( function() {
    cy.cleanDatabase()
    cy.factoryBotCreate({
      factory: 'teacher',
      password: 'password',
      email: 'someone@gmail.com'
    }).then(() => {
      cy.login('someone@gmail.com', 'password')
      cy.visit('teachers/classrooms/new')
    })
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('_quill_session')
  })


  describe('when I want to create a class', ()=>{
    describe('before I have input all the values', ()=>{
      it('will not let me', ()=>{
        cy.get('#new-classroom > .button-green').click()
        cy.url().should('not.contain', 'teachers/classrooms/invite_students')
      })
      describe('the errors', ()=>{
        it('exists', ()=>{
          cy.get('h4.errors')
        })
        it('will tell me there is no name if there is no name or grade', ()=>{
          cy.get('h4.errors').should('contain', 'name')
        })
        it('will tell me there no grade if there is a name but no grade', ()=>{
          fillInName()
          cy.get('#new-classroom > .button-green').click()
          cy.get('h4.errors').should('contain', 'grade')
        })

        it('will tell me there no name if there is a grade but no name', ()=>{
          cy.get('#class-name').clear()
          selectGradeFromDropdown()
          cy.get('#new-classroom > .button-green').click()
          cy.get('h4.errors').should('contain', 'name')
        })
      })
    })

    describe('the classcode', ()=>{

      it('changes when I click regenerate class code', ()=>{
        const oldValue = cy.get('.class-code').invoke('val')
        cy.get('#regenerate-class-code > span').click()
        expect(cy.get('.class-code').invoke('val')).not.to.equal(oldValue)
      })
    })

    describe('after I have input all the values and click the create a class button', ()=>{
      const fillInAllFormsAndClickButton = ()=>{
        selectGradeFromDropdown()
        fillInName(faker.name.jobArea() + ' ' + faker.name.jobTitle())
        cy.get('#new-classroom > .button-green').click()
      }

      describe('when I have no students or units',()=>{
        it ('brings me to the assign activities page', ()=> {
          fillInAllFormsAndClickButton()
          cy.url().should('contain', '/teachers/classrooms/assign_activities')
        })
      })

      describe('when I have students or units',()=>{
        before(()=>{
          cy.cleanDatabase()
          cy.factoryBotCreate({
            factory: 'teacher',
            traits: ['with_classrooms_students_and_activities'],
            password: 'password1',
            email: 'someone1@gmail.com',
            id: 1000
          }).then(() => {
            cy.login('someone1@gmail.com', 'password1')
            cy.visit('teachers/classrooms/new')
          })
          fillInAllFormsAndClickButton()
        })
        it ('brings me to the add students page', ()=> {
          cy.url().should('contain', 'teachers/classrooms/invite_students')
        })
      })
    })
  })




})
