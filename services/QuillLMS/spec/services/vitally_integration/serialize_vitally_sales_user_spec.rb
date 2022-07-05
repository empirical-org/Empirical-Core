# frozen_string_literal: true

require 'rails_helper'

describe 'SerializeVitallySalesUser' do
  before { Timecop.freeze }

  after { Timecop.return }

  let!(:current_time) { Time.current }
  let!(:school) { create(:school) }
  let!(:teacher) { create(:user, role: 'teacher', school: school)}
  let!(:classroom) { create(:classroom) }
  let!(:old_classroom) { create(:classroom, created_at: current_time - 1.year) }
  let!(:unit) { create(:unit, user_id: teacher.id) }
  let!(:old_unit) { create(:unit, user_id: teacher.id, created_at: current_time - 1.year) }
  let!(:classroom_unit) { create(:classroom_unit, classroom: classroom, unit: unit, assigned_student_ids: [student.id]) }
  let!(:old_classroom_unit) { create(:classroom_unit, classroom: old_classroom, unit: old_unit, created_at: current_time - 1.year, assigned_student_ids: [old_student.id]) }
  let!(:unit_activity) { create(:unit_activity, unit: unit) }
  let!(:diagnostic_unit_activity) { create(:unit_activity, :diagnostic_unit_activity, unit: unit) }
  let!(:old_unit_activity) { create(:unit_activity, unit: old_unit, created_at: current_time - 1.year) }
  let!(:student) { create(:user, role: 'student') }
  let!(:old_student) { create(:user, role: 'student') }

  before do
    create(:activity_classification, key: 'diagnostic')
    create(:activity_classification, key: 'evidence')

    previous_year_data = {
      total_students: 3,
      active_students: 2,
      activities_assigned: 3,
      completed_activities: 3,
      completed_activities_per_student: 1.5,
      percent_completed_activities: 1.0,
      diagnostics_assigned: 2,
      diagnostics_finished: 2,
      percent_completed_diagnostics: 1.0
    }
    year = School.school_year_start(1.year.ago).year
    CacheVitallyTeacherData.set(teacher.id, year, previous_year_data.to_json)
  end

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
      .to be_within(1.second).of(current_time)
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
      .of(current_time)
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
      premium_expiry_date: subscription.expiration,
      premium_state: teacher.premium_state,
      premium_type: teacher.subscription&.account_type,
      auditor: teacher.auditor?
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
    old_classroom = create(:classroom, created_at: current_time - 1.year)
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
      created_at: current_time - 1.year,
      completed_at: current_time - 1.year
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

    old_diagnostic_unit_activity = create(:unit_activity, :diagnostic_unit_activity, unit: old_unit, created_at: current_time - 1.year)
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
      created_at: current_time - 1.year,
      completed_at: current_time - 1.year
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

  it 'presents evidence data' do
    new_student = create(:user, role: 'student')
    create(:classrooms_teacher, user: teacher, classroom: classroom)
    create(:classrooms_teacher, user: teacher, classroom: old_classroom)
    create(:students_classrooms, student: student, classroom: classroom)
    create(:students_classrooms, student: old_student, classroom: old_classroom)
    create(:students_classrooms, student: new_student, classroom: classroom)
    classroom_unit.assigned_student_ids << new_student.id
    classroom_unit.save!

    evidence_unit_activity = create(:unit_activity, :evidence_unit_activity, unit: unit)
    middle_of_school_year = School.school_year_start(current_time) + 6.months
    create(:activity_session,
      classroom_unit: classroom_unit,
      activity: evidence_unit_activity.activity,
      user: student,
      state: 'finished',
      completed_at: middle_of_school_year - 10.days
    )
    create(:activity_session,
      classroom_unit: classroom_unit,
      activity: evidence_unit_activity.activity,
      user: student,
      state: 'finished',
      completed_at: middle_of_school_year - 3.days
    )
    create(:activity_session,
      classroom_unit: classroom_unit,
      activity: evidence_unit_activity.activity,
      user: new_student,
      state: 'started',
      created_at: middle_of_school_year - 1.year,
      completed_at: middle_of_school_year - 1.year
    )

    teacher_data = SerializeVitallySalesUser.new(teacher).data

    expect(teacher_data[:traits]).to include(
      evidence_activities_assigned_this_year: 2,
      evidence_activities_completed_this_year: 2,
      date_of_last_completed_evidence_activity: (middle_of_school_year - 3.days).strftime("%F")
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

  it 'presents previous year data' do
    teacher_data = SerializeVitallySalesUser.new(teacher).data
    expect(teacher_data[:traits]).to include(
      total_students_last_year: 3,
      active_students_last_year: 2,
      activities_assigned_last_year: 3,
      completed_activities_last_year: 3,
      completed_activities_per_student_last_year: 1.5,
      percent_completed_activities_last_year: 1.0,
      diagnostics_assigned_last_year: 2,
      diagnostics_finished_last_year: 2,
      percent_completed_diagnostics_last_year: 1.0
    )
  end

  context 'testing private methods' do
    let(:teacher) { create(:teacher, :with_classrooms_students_and_activities) }
    let(:classroom_unit) { [teacher.classroom_units[0]] }
    let(:records) { classroom_unit + [nil] }
    let(:vitally_user) { SerializeVitallySalesUser.new(teacher) }

    it 'handles nil record #sum_students' do
      expect(vitally_user.send(:sum_students, records)).to eq 3
    end
  end
end
