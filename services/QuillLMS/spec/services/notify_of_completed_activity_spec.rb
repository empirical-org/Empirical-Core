require 'rails_helper'

RSpec.describe NotifyOfCompletedActivity do
  it 'creates notification each for student and teachers' do
    activity  = create(:connect_activity, name: 'Cool Activity')
    student   = create(:simple_user,
      email: 'student@example.com',
      role: 'student'
    )
    teacher   = create(:simple_user, role: 'teacher')
    classroom = create(:simple_classroom)
    create(:students_classrooms, classroom: classroom, student: student)
    create(:classrooms_teacher, classroom: classroom, user: teacher)
    classroom_unit = create(:classroom_unit,
      classroom: classroom,
      assigned_student_ids: [student.id]
    )
    activity_session = create(:simple_activity_session,
      activity: activity,
      state: 'started',
      user: student,
      classroom_unit: classroom_unit
    )

    activity_session.update(state: 'finished')

    expect { NotifyOfCompletedActivity.new(activity_session).call }
      .to change(Notification, :count).by(2)
  end

  it 'saves a message on the student notification' do
    activity  = create(:connect_activity, name: 'Cool Activity')
    student   = create(:simple_user,
      email: 'student@example.com',
      role: 'student'
    )
    teacher   = create(:simple_user, role: 'teacher')
    classroom = create(:simple_classroom)
    create(:students_classrooms, classroom: classroom, student: student)
    create(:classrooms_teacher, classroom: classroom, user: teacher)
    classroom_unit = create(:classroom_unit,
      classroom: classroom,
      assigned_student_ids: [student.id]
    )
    activity_session = create(:simple_activity_session,
      activity: activity,
      state: 'started',
      user: student,
      classroom_unit: classroom_unit
    )

    activity_session.update(state: 'finished')
    NotifyOfCompletedActivity.new(activity_session).call
    notification = student.notifications.last

    expect(notification.text).to eq('Cool Activity completed')
  end

  it 'saves a message on the teacher notification' do
    activity  = create(:connect_activity, name: 'Cool Activity')
    student   = create(:simple_user,
      name: 'Billie Mitchell',
      email: 'student@example.com',
      role: 'student'
    )
    teacher   = create(:simple_user, role: 'teacher')
    classroom = create(:simple_classroom)
    create(:students_classrooms, classroom: classroom, student: student)
    create(:classrooms_teacher, classroom: classroom, user: teacher)
    classroom_unit = create(:classroom_unit,
      classroom: classroom,
      assigned_student_ids: [student.id]
    )
    activity_session = create(:simple_activity_session,
      activity: activity,
      state: 'started',
      user: student,
      classroom_unit: classroom_unit
    )

    activity_session.update(state: 'finished')
    NotifyOfCompletedActivity.new(activity_session).call
    notification = teacher.notifications.last

    expect(notification.text).to eq('Billie Mitchell completed Cool Activity')
  end

  it 'saves the path to the activity report on the teacher notification' do
    activity  = create(:connect_activity, name: 'Cool Activity')
    student   = create(:simple_user,
      name: 'Billie Mitchell',
      email: 'student@example.com',
      role: 'student'
    )
    teacher   = create(:simple_user, role: 'teacher')
    classroom = create(:simple_classroom)
    create(:students_classrooms, classroom: classroom, student: student)
    create(:classrooms_teacher, classroom: classroom, user: teacher)
    unit = create(:simple_unit)
    classroom_unit = create(:classroom_unit,
      unit: unit,
      classroom: classroom,
      assigned_student_ids: [student.id]
    )
    activity_session = create(:simple_activity_session,
      activity: activity,
      state: 'started',
      user: student,
      classroom_unit: classroom_unit
    )

    activity_session.update(state: 'finished')
    NotifyOfCompletedActivity.new(activity_session).call
    notification = teacher.notifications.last
    expected_path = "/teachers/progress_reports/diagnostic_reports#" +
      "/u/#{unit.id}/a/#{activity.id}/c/#{classroom.id}/student_report" +
      "/#{activity_session.id}"


    expect(notification.activity_student_report_path).to eq(expected_path)
  end

  it 'does not notify if state has not changed to finish' do
    activity = create(:connect_activity, name: 'Cool Activity')
    user = create(:simple_user, role: 'student')
    activity_session = create(:simple_activity_session,
      activity: activity,
      state: 'started',
      user: user,
    )

    notification = NotifyOfCompletedActivity.new(activity_session).call

    expect(notification).to be false
  end
end
