const faker = require('faker');

describe('manage class', function() {
  const newClassName = faker.name.jobArea() + ' ' + faker.name.jobTitle()
  const grade = 'University'

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
      cy.visit('teachers/classrooms/1/students')
    })
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('_quill_session')
  })

  it('renders', ()=>{
    cy.get('.edit-students')
  })

  describe('the tabs', ()=>{
    it('sets the manage classes tab to active', ()=> {
      cy.get('ul > :nth-child(1) > .active').should('contain', 'Manage Classes')
    })

    it('sets the classes tab to active', ()=> {
      cy.get('.active > a').should('contain', 'Classes')
    })
  })


  it('has a link to download pdfs', ()=> {
    cy.get('.name-and-download > button > a').should('have.attr', 'href').and('contain', 'student_logins')
  })

  it('shows the classes name and grade', ()=> {
    cy.get('#static-name-and-grade').should('not.be.empty').and('contain', 'Grade')
  })

  describe('the classroom dropdown', ()=> {
    it('can change the classroom getting edited', ()=>{
      cy.get('.dropdown-toggle').click()
    })

    it('holds elements that allow me to edit other classrooms', ()=> {
      cy.get('.dropdown-menu').find('a').should('have.length', 2)
    })

    describe('when I want to edit the classroom', ()=> {
      it('lets me change the name', ()=> {
        cy.get('#show-hide').click()
        cy.get('#classroom_name').clear().type(newClassName)
      })

      it('lets me change the grade', ()=> {
        cy.get('#classroom_grade').select('University')
      })

      it('lets me save my changes', ()=> {
        cy.get('#submit-button').click()
      })

      it('shows my changes in the name and grade section', ()=>{
        cy.get('#static-name-and-grade').should('contain', newClassName).and('contain', grade)
      })
    })

    describe('when I want to edit a students account', ()=>{
      it('has a link to do so', ()=> {
        cy.get('tbody > :nth-child(1) > :nth-child(4) > a')
          .should('contain', 'Edit Account')
          .and('have.attr', 'href')
          .and('contain', 'students')
          .and('contain', 'edit')
      })
    })

    describe('when I want to archive a class', ()=>{
      it('gives me a button to do so labeled Archive Class', ()=> {
        cy.get('.delete-class').should('contain', 'Archive Class')
      })
      it('directs me to the manage classes page, where I can see that my class was archived', ()=> {
        cy.get('.delete-class').click()
        cy.get('#inactive-classes > .table > tbody > tr > :nth-child(1)').should('contain', newClassName)
      })
    })


  })









})
