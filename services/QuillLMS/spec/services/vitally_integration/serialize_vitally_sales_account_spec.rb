# frozen_string_literal: true

require 'rails_helper'

describe VitallyIntegration::SerializeVitallySalesAccount do
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
    create(:activity_classification, key: 'evidence')
    previous_year_data = {
      total_students: 2,
      active_students: 1,
      activities_finished: 1,
      activities_per_student: 1.0,
      evidence_activities_assigned: 2,
      evidence_activities_completed: 1,
      completed_evidence_activities_per_student: 1
    }
    year = School.school_year_start(1.year.ago).year
    VitallyIntegration::CacheVitallySchoolData.set(school.id, year, previous_year_data.to_json)
  end

  it 'includes the accountId' do
    school_data = described_class.new(school).data

    expect(school_data).to include(accountId: school.id.to_s)
  end

  it 'includes the organizationId if the school has a subscription' do
    create(:school_subscription, school: school, subscription: subscription)

    school_data = described_class.new(school).data

    expect(school_data).to include(organizationId: school.district_id.to_s)
  end

  it 'includes the organizationId if a different school in the district has a subscription' do
    different_school = create(:school, district: district)
    create(:school_subscription, school: different_school, subscription: subscription)

    school_data = described_class.new(school).data

    expect(school_data).to include(organizationId: school.district_id.to_s)
  end

  it 'does not include the organizationId if no schools in the district have a subscription' do
    school_data = described_class.new(school).data

    expect(school_data).to include(organizationId: '')
  end

  it 'does not include the organizationId if the school is not part of a district' do
    school.update(district: nil)

    school_data = described_class.new(school).data

    expect(school_data).to include(organizationId: '')
  end

  it 'generates basic school params' do

    school_data = described_class.new(school).data

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
      school_subscription: described_class::NOT_APPLICABLE,
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
      school_link: "https://www.quill.org/cms/schools/#{school.id}",
      premium_expiry_date: described_class::NOT_APPLICABLE,
      premium_start_date: described_class::NOT_APPLICABLE,
      annual_revenue_current_contract: described_class::NOT_APPLICABLE,
      stripe_invoice_id_current_contract: described_class::NOT_APPLICABLE,
      purchase_order_number_current_contract: described_class::NOT_APPLICABLE
    )
  end

  it 'generates school premium status' do
    school_subscription = create(:subscription,
      account_type: 'SUPER SAVER PREMIUM',
      expiration: Date.tomorrow,
      payment_amount: '1800',
      stripe_invoice_id: 'in_12345678',
      purchase_order_number: 'PO-1234'
    )
    create(:school_subscription,
      subscription_id: school_subscription.id,
      school_id: school.id
    )

    school_data = described_class.new(school).data

    expect(school_data[:traits]).to include(
      school_subscription: school_subscription.account_type,
      premium_expiry_date: school_subscription.expiration,
      premium_start_date: school_subscription.start_date,
      annual_revenue_current_contract: school_subscription.payment_amount,
      stripe_invoice_id_current_contract: school_subscription.stripe_invoice_id,
      purchase_order_number_current_contract: school_subscription.purchase_order_number
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

    school_data = described_class.new(school).data

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

    school_data = described_class.new(school).data

    expect(school_data[:traits]).to include(
      employee_count: 2,
      paid_teacher_subscriptions: 1,
      active_students: 0,
      activities_finished: 0
    )
  end

  it 'generates previous year data' do
    school_data = described_class.new(school).data
    expect(school_data[:traits]).to include(
      total_students_last_year: 2,
      active_students_last_year: 1,
      activities_finished_last_year: 1,
      activities_per_student_last_year: 1.0
    )
  end

  context 'student data' do
    let!(:active_student) { create(:user, role: 'student', last_sign_in: Date.current) }
    let!(:active_old_student) { create(:user, role: 'student', last_sign_in: 2.years.ago) }
    let!(:inactive_student) { create(:user, role: 'student', last_sign_in: 2.years.ago) }
    let!(:teacher) { create(:user, role: 'teacher') }
    let!(:teacher2) { create(:user, role: 'teacher') }
    let!(:schools_users1) { create(:schools_users, school: school, user: teacher) }
    let!(:schools_users2) { create(:schools_users, school: school, user: teacher2) }
    let!(:classroom) { create(:classroom) }
    let!(:classroom_unit) { create(:classroom_unit, classroom: classroom) }
    let!(:old_classroom_unit) { create(:classroom_unit, classroom: classroom) }
    let!(:classroom_teachers) do
      [
        create(:classrooms_teacher, user: teacher, classroom: classroom),
        create(:classrooms_teacher, user: teacher2, classroom: classroom, role: 'coteacher')
      ]
    end
    let!(:student_classrooms) do
      [
        create(:students_classrooms, student: active_student, classroom: classroom),
        create(:students_classrooms, student: inactive_student, classroom: classroom),
        create(:students_classrooms, student: active_old_student, classroom: classroom)
      ]
    end
    let!(:recent_activity_session) do
      create(:activity_session,
        user: active_student,
        classroom_unit: classroom_unit,
        state: 'finished')
    end
    let!(:old_activity_session) do
      create(:activity_session,
        user: active_old_student,
        classroom_unit: old_classroom_unit,
        state: 'finished',
        completed_at: 2.year.ago,
        updated_at: 2.year.ago)
    end
    let!(:last_activity_session) do
      create(:activity_session,
        user: active_student,
        classroom_unit: classroom_unit,
        state: 'finished')
    end

    let(:results) { described_class.new(school).data }

    it do
      expect(results[:traits]).to include(
        active_students: 2,
        active_students_this_year: 1,
        total_students: 3,
        total_students_this_year: 1,
        activities_finished: 3,
        activities_finished_this_year: 2,
        activities_per_student: 1.5,
        activities_per_student_this_year: 2.0
      )
    end

    it { expect(results[:traits][:last_active]).to be_within(0.000001.second).of(last_activity_session.completed_at) }

    context 'archived activity_sessions' do
      before do
        ActivitySession.update_all(visible: false)
      end

      it { expect(results[:traits][:active_students]).to eq(2) }
    end
  end

  it 'generates evidence activities data' do
    teacher = create(:user, role: 'teacher')
    teacher_two = create(:user, role: 'teacher')
    create(:schools_users, school: school, user: teacher)
    create(:schools_users, school: school, user: teacher_two)
    student = create(:user, role: 'student')
    student_two = create(:user, role: 'student')
    student_three = create(:user, role: 'student')

    classroom = create(:classroom)
    classroom_two = create(:classroom)
    create(:classrooms_teacher, user: teacher, classroom: classroom)
    create(:classrooms_teacher, user: teacher_two, classroom: classroom_two)
    create(:students_classrooms, student: student, classroom: classroom)
    create(:students_classrooms, student: student_three, classroom: classroom_two)
    unit = create(:unit, user_id: teacher.id)
    unit_two = create(:unit, user_id: teacher_two.id)
    classroom_unit = create(:classroom_unit, classroom: classroom, unit: unit, assigned_student_ids: [student.id, student_two.id])
    classroom_unit_two = create(:classroom_unit, classroom: classroom_two, unit: unit_two, assigned_student_ids: [student_three.id])

    evidence_unit_activity = create(:unit_activity, :evidence_unit_activity, unit: unit)
    evidence_unit_activity_two = create(:unit_activity, :evidence_unit_activity, unit: unit_two)
    middle_of_school_year = School.school_year_start(Time.current) + 6.months
    create(:activity_session,
      classroom_unit: classroom_unit,
      activity: evidence_unit_activity.activity,
      user: student,
      state: 'finished',
      completed_at: middle_of_school_year - 10.days
    )
    create(:activity_session,
      classroom_unit: classroom_unit_two,
      activity: evidence_unit_activity_two.activity,
      user: student_three,
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
      user: student,
      state: 'finished',
      completed_at: middle_of_school_year - 5.days
    )
    create(:activity_session,
      classroom_unit: classroom_unit,
      activity: evidence_unit_activity.activity,
      user: student_two,
      state: 'finished',
      created_at: middle_of_school_year - 1.year,
      completed_at: middle_of_school_year - 1.year
    )
    create(:activity_session,
      classroom_unit: classroom_unit,
      activity: evidence_unit_activity.activity,
      user: student_two,
      state: 'started',
      created_at: middle_of_school_year - 1.year,
      completed_at: middle_of_school_year - 1.year
    )

    school_data = described_class.new(school).data

    expect(school_data[:traits]).to include(
      evidence_activities_assigned_all_time: 3,
      evidence_activities_assigned_this_year: 3,
      evidence_activities_assigned_last_year: 2,
      evidence_activities_completed_all_time: 5,
      evidence_activities_completed_this_year: 4,
      evidence_activities_completed_last_year: 1,
      evidence_activities_completed_per_student_this_year: 2,
      evidence_activities_completed_per_student_last_year: 1
    )
  end
end
