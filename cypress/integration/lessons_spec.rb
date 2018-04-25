describe('Classroom Lesssons', () => {

  it('can create a new lesson', () => {
    cy.visit('http://localhost:8080/#/admin/classroom-lessons')
    cy.get('.add-new-lesson-form').find('input').type('cool lesson')
    cy.get('.add-new-lesson-form').find('a').contains('Add New Lesson').click()

    cy.wait(250)

    cy.get('.add-new-lesson-form').find('input').type('cool edition')
    cy.get('.add-new-lesson-form').find('a').contains('Add New Edition').click()

    cy.get('ul.classroom-lessons-index').within(() => {
      cy.get('li span:first').click()
    })

    cy.get('.add-new-slide-form').find('select').select('Static')
    cy.get('.add-new-slide-form').find('a').contains('Add Slide').click()
    cy.go('back')

    cy.get('.add-new-slide-form').find('select').select('Model')
    cy.get('.add-new-slide-form').find('a').contains('Add Slide').click()
    cy.go('back')

    cy.get('.add-new-slide-form').find('select').select('Single Answer')
    cy.get('.add-new-slide-form').find('a').contains('Add Slide').click()
    cy.go('back')

    cy.get('.add-new-slide-form').find('select').select('Fill In The Blanks')
    cy.get('.add-new-slide-form').find('a').contains('Add Slide').click()
    cy.go('back')

    cy.get('.add-new-slide-form').find('select').select('Fill In The List')
    cy.get('.add-new-slide-form').find('a').contains('Add Slide').click()
    cy.go('back')

    cy.get('.add-new-slide-form').find('select').select('Multistep')
    cy.get('.add-new-slide-form').find('a').contains('Add Slide').click()
    cy.go('back')

    cy.get('h4').find('a').contains('cool lesson').click()
    cy.get('ul.classroom-lessons-index').within(() => {
      cy.get('li:first').find('span').contains('Preview').click()
    })
  })
})
