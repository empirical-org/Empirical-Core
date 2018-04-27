const openSocket = require('socket.io-client');
const socket     = openSocket('http://localhost:8000');

describe('Classroom Lesssons', () => {

  beforeEach(() => {
    cy.cleanDatabase()
    cy.createPreviewLesson()
  })

  it('does great things', () => {
  })
})
