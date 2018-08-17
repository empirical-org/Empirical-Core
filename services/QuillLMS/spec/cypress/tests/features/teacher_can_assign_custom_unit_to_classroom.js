describe('Teacher assigns custom unit', () => {
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
      ['create', 'simple_unit', {
        user_id: 101,
        name: 'Simple Unit'
      }],
      ['create', 'simple_user', {
        id: 102,
        name: 'Little Billie',
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
      ['create', 'activity', {
        id: 101,
        name: 'Good Activity',
        flags: ['production'],
      }]
    ])

    cy.login('fake@example.com', 'password')
    cy.visit('/')
    cy.contains('Assign Activities').click()

    cy.contains('Explore All Activities').click()

    cy.get('input[type="checkbox"]').last().click({ force: true })
    cy.contains('Continue').click()

    cy.get('input#unit_name').type('Good Unit')
    cy.get('label').contains('Cal-KOOL-us').click()
    cy.get('button').contains('Assign').click()

    cy.contains('My Activity Packs')
    cy.contains('Good Unit')
    cy.contains('Cal-KOOL-us')
  })
})
