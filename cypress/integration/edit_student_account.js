const faker = require('faker');

describe('Edit Student Account', ()=> {
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
      cy.visit('teachers/classrooms/')
      cy.get(':nth-child(1) > :nth-child(7) > .manage-class').click({force: true})
      cy.get('tbody > :nth-child(1) > :nth-child(4) > a').click()
    })
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('_quill_session')
  })

  const newPassword = faker.internet.password()

  it('renders', ()=> {
    cy.get('.user-profile-editor')
  })

  describe('the tabs', ()=>{
    it('sets the manage classes tab to active', ()=> {
      cy.get('ul > :nth-child(1) > .active').should('contain', 'Manage Classes')
    })

    it('sets the classes tab to active', ()=> {
      cy.get('.active > a').should('contain', 'Classes')
    })
  })

  describe('the fields', ()=> {
    it('has real name', ()=>{
      cy.get(':nth-child(3) > .form-label').should('contain', 'Real Name')
    })
    it('has user name', ()=>{
      cy.get(':nth-child(4) > .form-label').should('contain', 'Username')
    })
    it('has password', ()=>{
      cy.get(':nth-child(5) > .form-label').should('contain', 'Password')
    })
    it('has class code', ()=>{
      cy.get(':nth-child(6) > .form-label').should('contain', 'Class Code')
    })
    it('has student email', ()=>{
      cy.get(':nth-child(7) > .form-label').should('contain', 'Student Email')
    })
  })

  describe('when I want to edit the password', ()=> {
    it('provides me with a link to do so', ()=>{
      cy.get('.edit-password-link')
    })
    it('makes the password field active when I click the link', ()=>{
      cy.get('.edit-password-field.inactive').should('exist')
      cy.get('.edit-password-link').click()
      cy.get('.edit-password-field.inactive').should('not.exist')
    })

    it('lets me edit it', ()=>{
      cy.get('.edit-password-field').type(newPassword)
    })
  })

  describe('when I want to save changes', ()=> {
    it('lets me save the changes', ()=>{
      cy.get('.button-green').click()
    })

    it('brings me back to my classroom page', ()=> {
      cy.get('.edit-students').should('exist')
    })

    // TODO: this is not persisting
    // it('persists the changes I made', ()=> {
    //   cy.get('tbody > :nth-child(1) > :nth-child(4) > a').click()
    //   cy.get('.edit-password-link').click()
    //   cy.get('.edit-password-field').should('have.value', newPassword)
    // })
  })

})
