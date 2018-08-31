describe('Teacher edits an exsiting classroom', () => {
  beforeEach(() => {
    cy.app('clean')
  })

  it('they see the changes after saving', () => {
    cy.appFactories([
      ['create', 'simple_user', {
        id: 101,
        role: 'teacher',
        password: 'password',
        email: 'someone@gmail.com',
      }],
      ['create', 'simple_classroom', {
        id: 101,
        grade: 'Kindergarten'

      }],
      ['create', 'classrooms_teacher', {
        classroom_id: 101,
        user_id: 101
      }]
    ])

    cy.login('someone@gmail.com', 'password')
    cy.visit('teachers/classrooms/')

    cy.get('a').contains('Edit Students').first().click({ force: true })

    cy.contains('Edit Class Name And Grade').click()

    cy.get('input#classroom_name').clear().type('Testing 101')
    cy.get('select#classroom_grade').select('University')
    cy.contains('Save Changes').click()

    cy.get('h2').should('contain', 'Testing 101 Grade: University')
  })
})
