require 'rails_helper'

describe 'SerializeSalesContact' do
  before { Timecop.freeze }
  after { Timecop.return }

  it 'includes the contact_uid in the data' do
    teacher = create(:user, role: 'teacher')

    teacher_data = SerializeSalesContact.new(teacher.id).data

    expect(teacher_data).to include(contact_uid: teacher.id.to_s)
  end

  it 'presents teacher data' do
    school = create(:school, name: 'Kool Skool', free_lunches: 13)
    teacher = create(:user,
      name: 'Pops McGee',
      role: 'teacher',
      email: 'teach@teaching.edu',
    )
    school.users << teacher

    teacher_data = SerializeSalesContact.new(teacher.id).data

    expect(teacher_data[:params]).to include(
      email: 'teach@teaching.edu',
      name: 'Pops Mcgee',
      school: 'Kool Skool',
      account_uid: school.id.to_s,
      signed_up: teacher.created_at.to_i,
      admin: false,
      premium_status: 'NA',
      premium_expiry_date: 'NA',
      number_of_students: 0,
      number_of_completed_activities: 0,
      number_of_completed_activities_per_student: 0,
      frl: 13,
      teacher_link: "https://www.quill.org/cms/users/#{teacher.id}/sign_in",
      city: school.city,
      state: school.state,
    )
  end

  it 'presents sales stage timestamps' do
    teacher = create(:user, role: 'teacher')
    notifier = double('notifier', perform_async: nil)
    UpdateSalesContact.new(teacher.id, '1', nil, notifier).call
    teacher_data = SerializeSalesContact.new(teacher.id).data

    expect(teacher_data[:params][:basic_subscription])
      .to be_within(1.second).of(Time.now)
  end

  it 'does not present account data if not available' do
    school = create(:school)
    teacher = create(:user, role: 'teacher')
    school.users << teacher
    CreateSalesContact.new(teacher.id).call
    account_data = SerializeSalesContact.new(teacher.id).account_data

    expect(account_data).to be nil
  end

  it 'presents account data if available' do
    school = create(:school)
    teacher = create(:user, role: 'teacher')
    school.users << teacher
    notifier = double('notifier', perform_async: nil)
    UpdateSalesContact.new(teacher.id, '1', nil, notifier).call
    account_data = SerializeSalesContact.new(teacher.id).account_data

    expect(account_data).to include(account_uid:
      school.id.to_s,
      method: 'account',
    )
    expect(account_data[:params][:basic_subscription]).to be_within(1.second)
      .of(Time.now)
  end

  it 'presents admin status' do
    school = create(:school)
    teacher = create(:user, role: 'teacher')
    create(:schools_admins, school: school, user: teacher)

    teacher_data = SerializeSalesContact.new(teacher.id).data

    expect(teacher_data[:params]).to include(admin: true)
  end

  it 'presents premium status' do
    subscription = create(:subscription, account_type: 'SUPER DUPER SUB')
    teacher = create(:user, role: 'teacher')
    create(:user_subscription, subscription: subscription, user: teacher)

    teacher_data = SerializeSalesContact.new(teacher.id).data

    expect(teacher_data[:params]).to include(
      premium_status: 'SUPER DUPER SUB',
      premium_expiry_date: subscription.expiration,
    )
  end

  it 'presents premium status of the subscription with latest expiration date' do
    subscription = create(:subscription, account_type: 'SUPER DUPER SUB')
    next_subscription = create(:subscription, account_type: 'SUPER DUPER SUB', expiration: Date.tomorrow + 1.year, start_date: Date.tomorrow)
    teacher = create(:user, role: 'teacher')
    create(:user_subscription, subscription: subscription, user: teacher)
    create(:user_subscription, subscription: next_subscription, user: teacher)

    teacher_data = SerializeSalesContact.new(teacher.id).data

    expect(teacher_data[:params]).to include(
      premium_status: 'SUPER DUPER SUB',
      premium_expiry_date: next_subscription.expiration,
    )
  end

  it 'presents expiration date but not premium status when subscription expired' do
    subscription = create(:subscription, account_type: 'SUPER DUPER SUB', expiration: Date.yesterday)
    teacher = create(:user, role: 'teacher')
    create(:user_subscription, subscription: subscription, user: teacher)

    teacher_data = SerializeSalesContact.new(teacher.id).data

    expect(teacher_data[:params]).to include(
      premium_status: 'NA',
      premium_expiry_date: Date.yesterday,
    )
  end

  it 'presents student data' do
    teacher = create(:user, role: 'teacher')
    classroom = create(:classroom)
    student = create(:user, role: 'student')
    create(:classrooms_teacher, user: teacher, classroom: classroom)
    create(:students_classrooms, student: student, classroom: classroom)

    teacher_data = SerializeSalesContact.new(teacher.id).data

    expect(teacher_data[:params]).to include(
      number_of_students: 1,
      number_of_completed_activities: 0,
      number_of_completed_activities_per_student: 0,
    )
  end

  it 'presents activity data' do
    school = create(:school)
    teacher = create(:user, role: 'teacher')
    school.users << teacher
    classroom = create(:classroom)
    classroom_unit = create(:classroom_unit, classroom: classroom)
    student = create(:user, role: 'student')
    create(:classrooms_teacher, user: teacher, classroom: classroom)
    create(:students_classrooms, student: student, classroom: classroom)
    create(:activity_session,
      classroom_unit: classroom_unit,
      user: student,
      state: 'finished',
    )
    create(:activity_session,
      classroom_unit: classroom_unit,
      user: student,
      state: 'started',
    )

    teacher_data = SerializeSalesContact.new(teacher.id).data

    expect(teacher_data[:params]).to include(
      number_of_students: 1,
      number_of_completed_activities: 1,
      number_of_completed_activities_per_student: 1,
    )
  end

  it 'presents school lunch data' do
    school = create(:school, free_lunches: 50)
    teacher = create(:user, role: 'teacher')
    school.users << teacher

    teacher_data = SerializeSalesContact.new(teacher.id).data

    expect(teacher_data[:params]).to include(frl: 50)
  end

  it 'presents teacher link' do
    teacher = create(:user, role: 'teacher')

    teacher_data = SerializeSalesContact.new(teacher.id).data

    expect(teacher_data[:params]).to include(
      teacher_link: "https://www.quill.org/cms/users/#{teacher.id}/sign_in"
    )
  end
end
