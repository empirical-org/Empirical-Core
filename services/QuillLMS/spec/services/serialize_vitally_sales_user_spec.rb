require 'rails_helper'

describe 'SerializeVitallySalesUser' do
  before { Timecop.freeze }
  after { Timecop.return }
  let!(:school) { create(:school) }
  let!(:teacher) { create(:user, role: 'teacher', school: school)}
  let!(:classroom) { create(:classroom) }
  let!(:old_classroom) { create(:classroom, created_at: Time.now - 1.year) }
  let!(:unit) { create(:unit, user_id: teacher.id) }
  let!(:old_unit) { create(:unit, user_id: teacher.id, created_at: Time.now - 1.year) }
  let!(:classroom_unit) { create(:classroom_unit, classroom: classroom, unit: unit, assigned_student_ids: [ student.id ]) }
  let!(:old_classroom_unit) { create(:classroom_unit, classroom: old_classroom, unit: old_unit, created_at: Time.now - 1.year, assigned_student_ids: [old_student.id]) }
  let!(:unit_activity) { create(:unit_activity, unit: unit) }
  let!(:diagnostic_unit_activity) { create(:unit_activity, :diagnostic_unit_activity, unit: unit) }
  let!(:old_unit_activity) { create(:unit_activity, unit: old_unit, created_at: Time.now - 1.year) }
  let!(:student) { create(:user, role: 'student') }
  let!(:old_student) { create(:user, role: 'student') }

  it 'includes the accountId and userId in the data' do
    teacher_data = SerializeVitallySalesUser.new(teacher).data

    expect(teacher_data).to include(accountId: teacher.school.id.to_s)
    expect(teacher_data).to include(userId: teacher.id.to_s)
  end

  it 'presents teacher data' do
    school = create(:school, name: 'Kool Skool', free_lunches: 13)
    teacher = create(:user,
      name: 'Pops McGee',
      role: 'teacher',
      email: 'teach@teaching.edu',
      school: school
    )

    teacher_data = SerializeVitallySalesUser.new(teacher).data

    expect(teacher_data[:traits]).to include(
      email: 'teach@teaching.edu',
      name: 'Pops Mcgee',
      school: 'Kool Skool',
      account_uid: school.id.to_s,
      signed_up: teacher.created_at.to_i,
      admin: false,
      premium_status: 'NA',
      premium_expiry_date: 'NA',
      total_students: 0,
      total_students_this_year: 0,
      active_students: 0,
      active_students_this_year: 0,
      completed_activities: 0,
      completed_activities_this_year: 0,
      completed_activities_per_student: 0,
      completed_activities_per_student_this_year: 0,
      frl: 13,
      teacher_link: "https://www.quill.org/cms/users/#{teacher.id}/sign_in",
      city: school.city,
      state: school.state
    )
  end

  it 'presents sales stage timestamps' do
    notifier = double('notifier', perform_async: nil)
    UpdateSalesContact.new(teacher.id, '1', nil, notifier).call
    teacher_data = SerializeVitallySalesUser.new(teacher).data

    expect(teacher_data[:traits][:basic_subscription])
      .to be_within(1.second).of(Time.now)
  end

  it 'does not present account data if not available' do
    CreateSalesContact.new(teacher.id).call
    account_data = SerializeVitallySalesUser.new(teacher).account_data

    expect(account_data).to be nil
  end

  it 'presents account data if available' do
    notifier = double('notifier', perform_async: nil)
    UpdateSalesContact.new(teacher.id, '1', nil, notifier).call
    account_data = SerializeVitallySalesUser.new(teacher).account_data

    expect(account_data).to include(accountId: school.id.to_s,
      type: 'account'
    )
    expect(account_data[:traits][:basic_subscription]).to be_within(1.second)
      .of(Time.now)
  end

  it 'presents admin status' do
    create(:schools_admins, school: school, user: teacher)

    teacher_data = SerializeVitallySalesUser.new(teacher).data

    expect(teacher_data[:traits]).to include(admin: true)
  end

  it 'presents premium status' do
    subscription = create(:subscription, account_type: 'SUPER DUPER SUB')
    create(:user_subscription, subscription: subscription, user: teacher)

    teacher_data = SerializeVitallySalesUser.new(teacher).data

    expect(teacher_data[:traits]).to include(
      premium_status: 'SUPER DUPER SUB',
      premium_expiry_date: subscription.expiration
    )
  end

  it 'presents premium status of the subscription with latest expiration date' do
    subscription = create(:subscription, account_type: 'SUPER DUPER SUB')
    next_subscription = create(:subscription, account_type: 'SUPER DUPER SUB', expiration: Date.tomorrow + 1.year, start_date: Date.tomorrow)

    create(:user_subscription, subscription: subscription, user: teacher)
    create(:user_subscription, subscription: next_subscription, user: teacher)

    teacher_data = SerializeVitallySalesUser.new(teacher).data

    expect(teacher_data[:traits]).to include(
      premium_status: 'SUPER DUPER SUB',
      premium_expiry_date: next_subscription.expiration
    )
  end

  it 'presents expiration date but not premium status when subscription expired' do
    subscription = create(:subscription, account_type: 'SUPER DUPER SUB', expiration: Date.yesterday)
    create(:user_subscription, subscription: subscription, user: teacher)

    teacher_data = SerializeVitallySalesUser.new(teacher).data

    expect(teacher_data[:traits]).to include(
      premium_status: 'NA',
      premium_expiry_date: Date.yesterday
    )
  end

  it 'presents student data' do
    classroom = create(:classroom)
    old_classroom = create(:classroom, created_at: Time.now - 1.year)
    student = create(:user, role: 'student')
    old_student = create(:user, role: 'student')
    create(:classrooms_teacher, user: teacher, classroom: classroom)
    create(:classrooms_teacher, user: teacher, classroom: old_classroom)
    create(:students_classrooms, student: student, classroom: classroom)
    create(:students_classrooms, student: old_student, classroom: old_classroom)

    teacher_data = SerializeVitallySalesUser.new(teacher).data

    expect(teacher_data[:traits]).to include(
      total_students: 2,
      total_students_this_year: 1,
      completed_activities: 0,
      completed_activities_this_year: 0,
      completed_activities_per_student: 0,
      completed_activities_per_student_this_year: 0
    )
  end

  it 'presents activity assigned data' do
    create(:classrooms_teacher, user: teacher, classroom: classroom)
    create(:classrooms_teacher, user: teacher, classroom: old_classroom)
    create(:students_classrooms, student: student, classroom: classroom)
    create(:students_classrooms, student: old_student, classroom: old_classroom)

    teacher_data = SerializeVitallySalesUser.new(teacher).data

    expect(teacher_data[:traits]).to include(
      activities_assigned: 3,
      activities_assigned_this_year: 2
    )
  end

  it 'presents activity completed data' do
    create(:classrooms_teacher, user: teacher, classroom: classroom)
    create(:classrooms_teacher, user: teacher, classroom: old_classroom)
    create(:students_classrooms, student: student, classroom: classroom)
    create(:students_classrooms, student: old_student, classroom: old_classroom)
    create(:activity_session,
      classroom_unit: classroom_unit,
      activity: unit_activity.activity,
      user: student,
      state: 'finished'
    )
    create(:activity_session,
      classroom_unit: old_classroom_unit,
      activity: old_unit_activity.activity,
      user: old_student,
      state: 'finished',
      created_at: Time.now - 1.year,
      completed_at: Time.now - 1.year
    )
    create(:activity_session,
      classroom_unit: classroom_unit,
      activity: diagnostic_unit_activity.activity,
      user: student,
      state: 'started'
    )
    teacher_data = SerializeVitallySalesUser.new(teacher).data

    expect(teacher_data[:traits]).to include(
      completed_activities: 2,
      completed_activities_per_student: 1.0,
      completed_activities_this_year: 1,
      completed_activities_per_student_this_year: 1.0,
      percent_completed_activities_this_year: 0.5,
      percent_completed_activities: 0.67
    )
  end

  it 'presents diagnostic data' do
    new_student = create(:user, role: 'student')
    create(:classrooms_teacher, user: teacher, classroom: classroom)
    create(:classrooms_teacher, user: teacher, classroom: old_classroom)
    create(:students_classrooms, student: student, classroom: classroom)
    create(:students_classrooms, student: old_student, classroom: old_classroom)
    create(:students_classrooms, student: new_student, classroom: old_classroom)
    classroom_unit.assigned_student_ids << new_student.id
    classroom_unit.save!

    old_diagnostic_unit_activity = create(:unit_activity, :diagnostic_unit_activity, unit: old_unit, created_at: Time.now - 1.year)
    create(:activity_session,
      classroom_unit: classroom_unit,
      activity: diagnostic_unit_activity.activity,
      user: student,
      state: 'finished'
    )
    create(:activity_session,
      classroom_unit: old_classroom_unit,
      activity: old_diagnostic_unit_activity.activity,
      user: old_student,
      state: 'finished',
      created_at: Time.now - 1.year,
      completed_at: Time.now - 1.year
    )

    teacher_data = SerializeVitallySalesUser.new(teacher).data

    expect(teacher_data[:traits]).to include(
      diagnostics_assigned: 3,
      diagnostics_finished: 2,
      diagnostics_assigned_this_year: 2,
      diagnostics_finished_this_year: 1,
      percent_completed_diagnostics: 0.67,
      percent_completed_diagnostics_this_year: 0.5
    )
  end

  it 'presents school lunch data' do
    teacher_data = SerializeVitallySalesUser.new(teacher).data

    expect(teacher_data[:traits]).to include(frl: 50)
  end

  it 'presents teacher link' do
    expect(teacher.school).not_to be_nil

    teacher_data = SerializeVitallySalesUser.new(teacher).data

    expect(teacher_data[:traits]).to include(
      teacher_link: "https://www.quill.org/cms/users/#{teacher.id}/sign_in"
    )
  end
end
