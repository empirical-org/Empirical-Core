require 'rails_helper'

describe 'SerializeSalesAccount' do
  let(:school) do
    create(:school,
      name: 'Kool School',
      mail_city: 'New York',
      mail_state: 'NY',
      mail_zipcode: '11104',
      leanm: 'Kool District',
      phone: '555-666-3210',
      charter: 'N',
      free_lunches: 0,
      ppin: nil,
      nces_id: '111111111',
      ulocal: '41',
    )
  end

  it 'includes the account_uid' do
    school_data = SerializeSalesAccount.new(school.id).data

    expect(school_data).to include(account_uid: school.id.to_s)
  end

  it 'generates basic school params' do

    school_data = SerializeSalesAccount.new(school.id).data

    expect(school_data[:params]).to include(
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
      activities_finished: 0,
      school_link: "https://www.quill.org/cms/schools/#{school.id}",
    )
  end

  it 'generates school premium status' do
    school_subscription = create(:subscription,
      account_type: 'SUPER SAVER PREMIUM',
      expiration: Date.tomorrow,
    )
    create(:school_subscription,
      subscription_id: school_subscription.id,
      school_id: school.id,
    )

    school_data = SerializeSalesAccount.new(school.id).data

    expect(school_data[:params]).to include(
      school_subscription: 'SUPER SAVER PREMIUM',
    )
    expect(school_data[:params]).to include(
      premium_expiry_date: Date.tomorrow,
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

    school_data = SerializeSalesAccount.new(school.id).data

    expect(school_data[:params]).to include(
      school_subscription: next_school_subscription.account_type
    )
    expect(school_data[:params]).to include(
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

    school_data = SerializeSalesAccount.new(school.id).data

    expect(school_data[:params]).to include(
      employee_count: 2,
      paid_teacher_subscriptions: 1,
      active_students: 0,
      activities_finished: 0,
    )
  end

  it 'generates student data' do
    active_student = create(:user, role: 'student')
    teacher = create(:user, role: 'teacher')
    classroom = create(:classroom)
    classroom_unit = create(:classroom_unit, classroom: classroom)
    create(:classrooms_teacher, user: teacher, classroom: classroom)
    create(:activity_session,
      user: active_student,
      classroom_unit: classroom_unit,
      state: 'finished'
    )
    create(:activity_session,
      user: active_student,
      classroom_unit: classroom_unit,
      state: 'finished'
    )
    school.users << active_student
    school.users << teacher
    school.users << create(:user, role: 'student')

    school_data = SerializeSalesAccount.new(school.id).data

    expect(school_data[:params]).to include(
      active_students: 1,
      activities_finished: 2,
    )
  end
end
