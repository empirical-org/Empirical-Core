describe('Teacher edits an exsiting classroom', () => {
  beforeEach(() => {
    cy.app('clean')
  })

  it('they see the changes after saving', () => {
    cy.appFactories([
      ['create', 'teacher', 'with_classrooms_students_and_activities', {
        password: 'password',
        email: 'someone@gmail.com',
      }]
    ])

    cy.login('someone@gmail.com', 'password')
    cy.visit('teachers/classrooms/')

    cy.get('a').contains('Edit Students').first().click({ force: true })

    cy.contains('Edit Class Name And Grade').click()

    cy.get('input#classroom_name').clear().type('Testing 245')
    cy.get('select#classroom_grade').select('University')
    cy.contains('Save Changes').click()

    cy.get('h2').should('contain', 'Testing 245 Grade: University')
  })
})
