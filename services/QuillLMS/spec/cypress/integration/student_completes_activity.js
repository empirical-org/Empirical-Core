describe('Student completes activity', () => {
  beforeEach(() => {
    cy.app('clean')
  })

  it('they should see a notification on their profile', () => {
    cy.appFactories([
      ['create', 'simple_user', {
        id: 101,
        email: 'fake@example.com',
        password: 'password',
        role: 'student',
      }],
      ['create', 'simple_user', {
        id: 102,
        email: 'fake_teacher@example.com',
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
        classroom_unit_id: 101,
        uid: 'UIDHERE',
        user_id: 101,
        activity_id: 101,
        state: 'started',
      }]
    ])

    cy.request('PUT', '/api/v1/activity_sessions/UIDHERE', {
      state: 'finished',
      percentage: 98.0
    })

    cy.login('fake@example.com', 'password')
    cy.visit('/')

    cy.get('table').contains('Groovy Activity completed')
  })
})
