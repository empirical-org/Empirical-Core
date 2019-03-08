describe('Teacher assigns entry diagnostic', () => {
  beforeEach(() => {
    cy.app('clean')
  })

  it('they see it assigned on the activity pack page', () => {
    cy.appFactories([
      ['create', 'simple_user', {
        id: 101,
        email: 'fake@example.com',
        password: 'password',
        role: 'teacher',
      }],
      ['create', 'simple_user', {
        id: 102,
        email: 'fake_student@example.com',
        role: 'student',
      }],
      ['create', 'simple_classroom', {
        id: 101,
        name: 'Cal-KOOL-us',
      }],
      ['create', 'classrooms_teacher', {
        user_id: 101,
        classroom_id: 101,
        role: 'owner',
      }],
      ['create', 'students_classrooms', {
        student_id: 102,
        classroom_id: 101,
      }],
      ['create', 'simple_unit_template', {
        id: 20
      }],
      ['create', 'simple_unit', {
        name: '123 Unit',
        id: 101,
        unit_template_id: 20,
      }],
      ['create', 'simple_activity', {
        name: 'ABCs Activity',
        id: 413,
      }],
      ['create', 'unit_activity', {
        unit_id: 101,
        activity_id: 413,
      }]
    ])

    cy.login('fake@example.com', 'password')
    cy.visit('/')
    cy.contains('Assign Activities').click()

    cy.contains('Entry Diagnostic').click()
    cy.contains('Sentence Structure Diagnostic').click()
    cy.contains('Next').click()
    cy.contains('Next').click()
    cy.contains('Next').click()
    cy.contains('Next, Assign the Diagnostic').click()
    cy.contains('Continue to Assign').click()

    cy.contains('Cal-KOOL-us').click()
    cy.contains('Save & Assign').click()

    cy.contains('View Assigned Activity Packs').click()

    cy.get('h1').contains('My Activity Packs')
    cy.contains('Cal-KOOL-us')
    cy.contains('ABCs Activity')
  })
})
