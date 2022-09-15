# frozen_string_literal: true

require 'rails_helper'

describe 'SerializeVitallySalesAccount' do
  let!(:district) { create(:district, name: 'Kool District') }
  let(:school) do
    create(:school,
      name: 'Kool School',
      mail_city: 'New York',
      mail_state: 'NY',
      mail_zipcode: '11104',
      district_id: district.id,
      phone: '555-666-3210',
      charter: 'N',
      free_lunches: 0,
      ppin: nil,
      nces_id: '111111111',
      ulocal: '41'
    )
  end
  let(:subscription) { create(:subscription, account_type: Subscription::SCHOOL_PAID) }

  before do
    previous_year_data = {
      total_students: 2,
      active_students: 1,
      activities_finished: 1,
      activities_per_student: 1.0
    }
    year = School.school_year_start(1.year.ago).year
    CacheVitallySchoolData.set(school.id, year, previous_year_data.to_json)
  end

  it 'includes the accountId' do
    school_data = SerializeVitallySalesAccount.new(school).data

    expect(school_data).to include(accountId: school.id.to_s)
  end

  it 'includes the organizationId if the school has a subscription' do
    create(:school_subscription, school: school, subscription: subscription)

    school_data = SerializeVitallySalesAccount.new(school).data

    expect(school_data).to include(organizationId: school.district_id.to_s)
  end

  it 'includes the organizationId if a different school in the district has a subscription' do
    different_school = create(:school, district: district)
    create(:school_subscription, school: different_school, subscription: subscription)

    school_data = SerializeVitallySalesAccount.new(school).data

    expect(school_data).to include(organizationId: school.district_id.to_s)
  end

  it 'does not include the organizationId if no schools in the district have a subscription' do
    school_data = SerializeVitallySalesAccount.new(school).data

    expect(school_data).to include(organizationId: '')
  end

  it 'does not include the organizationId if the school is not part of a district' do
    school.update(district: nil)

    school_data = SerializeVitallySalesAccount.new(school).data

    expect(school_data).to include(organizationId: '')
  end

  it 'generates basic school params' do

    school_data = SerializeVitallySalesAccount.new(school).data

    expect(school_data[:traits]).to include(
      name: 'Kool School',
      city: 'New York',
      state: 'NY',
      zipcode: '11104',
      district: 'Kool District',
      phone: '555-666-3210',
      charter: 'N',
      frl: 0,
      ppin: nil,
      nces_id: '111111111',
      school_subscription: 'NA',
      school_type: 'Rural, Fringe',
      employee_count: 0,
      paid_teacher_subscriptions: 0,
      active_students: 0,
      active_students_this_year: 0,
      total_students: 0,
      total_students_this_year: 0,
      activities_finished_this_year: 0,
      activities_per_student: 0,
      activities_per_student_this_year: 0,
      activities_finished: 0,
      school_link: "https://www.quill.org/cms/schools/#{school.id}"
    )
  end

  it 'generates school premium status' do
    school_subscription = create(:subscription,
      account_type: 'SUPER SAVER PREMIUM',
      expiration: Date.tomorrow
    )
    create(:school_subscription,
      subscription_id: school_subscription.id,
      school_id: school.id
    )

    school_data = SerializeVitallySalesAccount.new(school).data

    expect(school_data[:traits]).to include(
      school_subscription: 'SUPER SAVER PREMIUM'
    )
    expect(school_data[:traits]).to include(
      premium_expiry_date: Date.tomorrow
    )
  end

  it 'fetches the subscription with latest expiration date' do
    school_subscription = create(:subscription,
      account_type: 'SUPER SAVER PREMIUM',
      expiration: Date.tomorrow
    )
    next_school_subscription = create(:subscription,
      account_type: 'SUPER SAVER PREMIUM',
      expiration: Date.tomorrow + 1.year,
      start_date: Date.tomorrow
    )
    create(:school_subscription,
      subscription_id: school_subscription.id,
      school_id: school.id
    )
    create(:school_subscription,
      subscription_id: next_school_subscription.id,
      school_id: school.id
    )

    school_data = SerializeVitallySalesAccount.new(school).data

    expect(school_data[:traits]).to include(
      school_subscription: next_school_subscription.account_type
    )
    expect(school_data[:traits]).to include(
      premium_expiry_date: next_school_subscription.expiration
    )
  end

  it 'generates teacher data' do
    teacher_subscription = create(:subscription,
      account_type: 'Teacher Paid'
    )
    teacher_with_subscription = create(:user, role: 'teacher')
    create(:user_subscription,
      subscription: teacher_subscription,
      user: teacher_with_subscription
    )
    school.users << teacher_with_subscription
    school.users << create(:user, role: 'teacher')

    school_data = SerializeVitallySalesAccount.new(school).data

    expect(school_data[:traits]).to include(
      employee_count: 2,
      paid_teacher_subscriptions: 1,
      active_students: 0,
      activities_finished: 0
    )
  end

  it 'generates previous year data' do
    school_data = SerializeVitallySalesAccount.new(school).data
    expect(school_data[:traits]).to include(
      total_students_last_year: 2,
      active_students_last_year: 1,
      activities_finished_last_year: 1,
      activities_per_student_last_year: 1.0
    )
  end

  it 'generates student data' do
    active_student = create(:user, role: 'student', last_sign_in: Date.current)
    active_old_student = create(:user, role: 'student', last_sign_in: 2.years.ago)
    inactive_student = create(:user, role: 'student', last_sign_in: 2.years.ago)
    teacher = create(:user, role: 'teacher')
    teacher2 = create(:user, role: 'teacher')
    classroom = create(:classroom)
    classroom_unit = create(:classroom_unit, classroom: classroom)
    old_classroom_unit = create(:classroom_unit, classroom: classroom)
    create(:classrooms_teacher, user: teacher, classroom: classroom)
    create(:classrooms_teacher, user: teacher2, classroom: classroom, role: 'coteacher')
    create(:students_classrooms, student: active_student, classroom: classroom)
    create(:students_classrooms, student: inactive_student, classroom: classroom)
    create(:students_classrooms, student: active_old_student, classroom: classroom)
    create(:activity_session,
      user: active_student,
      classroom_unit: classroom_unit,
      state: 'finished'
    )
    create(:activity_session,
      user: active_old_student,
      classroom_unit: old_classroom_unit,
      state: 'finished',
      updated_at: 2.year.ago
    )
    last_activity_session = create(:activity_session,
      user: active_student,
      classroom_unit: classroom_unit,
      state: 'finished'
    )
    school.users << active_student
    school.users << inactive_student
    school.users << teacher
    school.users << teacher2
    school.users << create(:user, role: 'student')

    school_data = SerializeVitallySalesAccount.new(school).data

    expect(school_data[:traits]).to include(
      active_students: 2,
      active_students_this_year: 1,
      total_students: 3,
      total_students_this_year: 1,
      activities_finished: 3,
      activities_finished_this_year: 2,
      activities_per_student: 1.5,
      activities_per_student_this_year: 2.0
    )
    expect(school_data[:traits][:last_active]).to be_within(0.000001.second).of(last_activity_session.completed_at)
  end
end
