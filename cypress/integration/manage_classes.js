const faker = require('faker');

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

  after(()=>cy.cleanDatabase())

  describe('when I have no classrooms', ()=>{
    it('redirects me to the new classroom page', ()=>{
      cy.url().should('contain', 'teachers/classrooms/new')
    })
  })

  describe('when I have classrooms', ()=>{
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
      cy.get('tbody > :nth-child(1) > :nth-child(1)')
    })
  })
})
