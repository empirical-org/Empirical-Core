const openSocket = require('socket.io-client');
const socket     = openSocket('http://localhost:8000');

describe('Classroom Lesssons', () => {

  beforeEach(() => {
    cy.cleanDatabase()
    cy.createPreviewLesson()
  })

  it('allows teacher to click next button to advance slides', () => {
    cy.get('.lesson-title').should('contain', 'Lesson 1000')

    cy.get('button').contains('Next Slide').click()
    cy.get('.header h1').should('contain', 'Slide 1')

    cy.get('button').contains('Next Slide').click()
    cy.get('.header h1').should('contain', 'Slide 2')

    cy.get('button').contains('Next Slide').click()
    cy.get('.header h1').should('contain', 'Slide 3')

    cy.get('button').contains('Next Slide').click()
    cy.get('.header h1').should('contain', 'Slide 4')

    cy.get('button').contains('Next Slide').click()
    cy.get('.header h1').should('contain', 'Slide 5')

    cy.get('button').contains('Next Slide').click()
    cy.get('.header h1').should('contain', 'Slide 6')

    cy.get('button').contains('Next Slide').click()
    cy.get('.header h1').should('contain', 'Slide 7')
  })

  it('allows teacher to navigate the slides using sidebar', () => {
    cy.get('.lesson-title').should('contain', 'Lesson 1000')

    cy.get('.side-bar').find('#1 .slide-preview').click()
    cy.get('.header h1').should('contain', 'Slide 1')

    cy.get('.side-bar').find('#2 .slide-preview').click()
    cy.get('.header h1').should('contain', 'Slide 2')

    cy.get('.side-bar').find('#3 .slide-preview').click()
    cy.get('.header h1').should('contain', 'Slide 3')

    cy.get('.side-bar').find('#4 .slide-preview').click()
    cy.get('.header h1').should('contain', 'Slide 4')

    cy.get('.side-bar').find('#5 .slide-preview').click()
    cy.get('.header h1').should('contain', 'Slide 5')

    cy.get('.side-bar').find('#6 .slide-preview').click()
    cy.get('.header h1').should('contain', 'Slide 6')

    cy.get('.side-bar').find('#7 .slide-preview').click()
    cy.get('.header h1').should('contain', 'Slide 7')
  })

  it('allows teacher to flag and unflag a student', () => {
    cy.url().then((urlString) => {
      urlString = urlString.split('classroom_activity_id=')
      const classroomUnitId = urlString[1]

      cy.addStudent(classroomUnitId, 'Milton')
    })
  })
})
