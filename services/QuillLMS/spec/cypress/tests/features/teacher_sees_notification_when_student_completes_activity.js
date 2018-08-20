describe('Student completes activity', () => {
  beforeEach(() => {
    cy.app('clean')
  })

  it('their teacher sees notification on the dashboard', () => {
    cy.appFactories([
      ['create', 'simple_user', {
        id: 101,
        name: 'Billie McGrane',
        email: 'student@example.com',
        password: 'password',
        role: 'student',
      }],
      ['create', 'simple_user', {
        id: 102,
        email: 'teacher@example.com',
        password: 'password',
        role: 'teacher',
      }],
      ['create', 'simple_classroom', {
        id: 101,
      }],
      ['create', 'classrooms_teacher', {
        user_id: 102,
        classroom_id: 101,
        role: 'owner',
      }],
      ['create', 'students_classrooms', {
        student_id: 101,
        classroom_id: 101,
      }],
      ['create', 'simple_unit', {
        id: 101,
        name: 'Groovy Unit',
        visible: true
      }],
      ['create', 'connect_activity', {
        id: 101,
        repeatable: false,
        name: 'Groovy Activity',
      }],
      ['create', 'classroom_unit', {
        id: 101,
        classroom_id: 101,
        unit_id: 101,
        visible: true,
        assigned_student_ids: [101]
      }],
      ['create', 'unit_activity', {
        unit_id: 101,
        activity_id: 101,
        visible: true
      }],
      ['create', 'simple_activity_session', {
        id: 101,
        classroom_unit_id: 101,
        uid: 'UIDHERE',
        user_id: 101,
        activity_id: 101,
        state: 'started',
      }]
    ])

    cy.login('teacher@example.com', 'password')
    cy.visit('/')

    cy.contains('Billie McGrane completed Groovy Activity').should('not.exist')

    cy.request('PUT', '/api/v1/activity_sessions/UIDHERE', {
      state: 'finished',
      percentage: 0.98
    })
    cy.reload()

    cy.contains('Billie Mcgrane completed Groovy Activity').should(
      'have.prop',
      'href',
      'http://localhost:3000/teachers/progress_reports/diagnostic_reports#/u/101/a/101/c/101/student_report/101'
    )
  })
})
