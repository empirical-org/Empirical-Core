# frozen_string_literal: true

# == Schema Information
#
# Table name: districts
#
#  id             :integer          not null, primary key
#  city           :string
#  grade_range    :string
#  name           :string           not null
#  phone          :string
#  state          :string
#  token          :string
#  total_schools  :integer
#  total_students :integer
#  zipcode        :string
#  created_at     :datetime
#  updated_at     :datetime
#  clever_id      :string
#  nces_id        :bigint
#
# Indexes
#
#  index_districts_on_nces_id  (nces_id) UNIQUE
#
require 'rails_helper'

describe District, type: :model do
  let!(:district) { create(:district) }

  it { should validate_uniqueness_of(:nces_id).with_message("A district with this NCES ID already exists.") }
  it { should allow_value("", nil).for(:nces_id) }

  it { should have_many(:schools) }
  it { should have_many(:district_admins) }
  it { should have_many(:admins).through(:district_admins) }

  it_behaves_like 'a subscriber'

  context '#total_invoice' do
    let!(:district) { create(:district)}
    let!(:school) { create(:school)}
    let!(:another_school) { create(:school)}
    let!(:subscription) { create(:subscription, payment_amount: 500)}
    let!(:another_subscription) { create(:subscription, payment_amount: 100)}

    it 'should return 0 if there are no schools in the district' do
      expect(district.total_invoice).to eq(0)
    end

    it 'should return the total invoice amount for that districts schools divided by 100' do
      school.update(district: district)
      another_school.update(district: district)
      create(:school_subscription, school: school, subscription: subscription)
      create(:school_subscription, school: another_school, subscription: another_subscription)

      expect(district.total_invoice).to eq((subscription.payment_amount + another_subscription.payment_amount) / 100)
    end
  end

  context '#vitally_data' do
    let!(:district) { create(:district) }
    let!(:school1) { create(:school, district: district) }
    let!(:teacher1) { create(:teacher, school: school1) }
    let!(:classroom1) { create(:classroom) }
    let!(:classroom_teacher1) { create(:classrooms_teacher, user: teacher1, classroom: classroom1) }
    let!(:student1) { create(:student, student_in_classroom: [classroom1]) }
    let!(:student2) { create(:student, student_in_classroom: [classroom1]) }
    let!(:diagnostic) { create(:diagnostic_activity) }
    let!(:unit) { create(:unit, activities: [diagnostic]) }

    it 'should return vitally payload with correct data when no diagnostics have been assigned' do
      expect(district.vitally_data).to eq({
        externalId: district.id.to_s,
        name: district.name,
        traits: {
          name: district.name,
          nces_id: district.nces_id,
          clever_id: district.clever_id,
          city: district.city,
          state: district.state,
          zipcode: district.zipcode,
          phone: district.phone,
          total_students: district.total_students,
          total_schools: district.total_schools,
          diagnostics_assigned_this_year: 0,
          diagnostics_assigned_last_year: 0,
          diagnostics_completed_this_year: 0,
          diagnostics_completed_last_year: 0,
          percent_diagnostics_completed_this_year: 0,
          percent_diagnostics_completed_last_year: 0,
          premium_start_date: 'N/A',
          premium_expiry_date: 'N/A',
          district_subscription: 'N/A',
          annual_revenue_current_contract: 'N/A',
          stripe_invoice_id_current_contract: 'N/A'
        }
      })
    end

    context 'diagnostic assignment rollups' do
      let!(:classroom_unit) { create(:classroom_unit, classroom: classroom1, unit: unit, assigned_student_ids: [student1.id, student2.id]) }

      it 'should roll up diagnostic data when diagnostics are assigned, but not completed' do
        expect(district.vitally_data[:traits]).to include(
          diagnostics_assigned_this_year: 2,
          diagnostics_completed_this_year: 0,
          diagnostics_assigned_last_year: 0
        )
      end

      it 'should roll up diagnostic data when diagnostics are assigned last year' do
        classroom_unit.update(created_at: 1.year.ago)

        expect(district.vitally_data[:traits]).to include(
          diagnostics_assigned_this_year: 0,
          diagnostics_assigned_last_year: 2
        )
      end

      it 'should roll up diagnostic data across multiple classrooms' do
        school2 = create(:school, district: district)
        teacher2 = create(:teacher, school: school2)
        classroom2 = create(:classroom)
        create(:classrooms_teacher, user: teacher2, classroom: classroom2)
        student3 = create(:student)
        create(:classroom_unit, classroom: classroom2, unit: unit, assigned_student_ids: [student2.id, student3.id])

        expect(district.vitally_data[:traits]).to include(
          diagnostics_assigned_this_year: 4
        )
      end

      it 'should ignore assigned activities that are not diagnostics' do
        classification = create(:connect)
        diagnostic.update(classification: classification)

        expect(district.vitally_data[:traits]).to include(
          diagnostics_assigned_last_year: 0
        )
      end
    end

    context 'diagnostic completion rollups' do
      let!(:classroom_unit) { create(:classroom_unit, classroom: classroom1, unit: unit, assigned_student_ids: [student1.id, student2.id]) }
      let!(:activity_session1) { create(:activity_session, activity: diagnostic, classroom_unit: classroom_unit, user: student1, completed_at: Time.current) }

      it 'should roll up diagnostic completions this year' do
        expect(district.vitally_data[:traits]).to include(
          diagnostics_completed_this_year: 1,
          diagnostics_completed_last_year: 0
        )
      end

      it 'should roll up diagnostic completions from last year' do
        activity_session1.update(completed_at: 1.year.ago)

        expect(district.vitally_data[:traits]).to include(
          diagnostics_completed_this_year: 0,
          diagnostics_completed_last_year: 1
        )
      end

      it 'should not count activity_session records that are not completed' do
        activity_session1.update(completed_at: nil, state: 'started')

        expect(district.vitally_data[:traits]).to include(
          diagnostics_completed_this_year: 0
        )
      end

      it 'should roll up data across multiple schools' do
        school2 = create(:school, district: district)
        teacher2 = create(:teacher, school: school2)
        classroom2 = create(:classroom)
        student3 = create(:student)
        create(:classrooms_teacher, user: teacher2, classroom: classroom2)
        classroom_unit2 = create(:classroom_unit, classroom: classroom2, unit: unit, assigned_student_ids: [student2.id, student3.id])

        create(:activity_session, activity: diagnostic, classroom_unit: classroom_unit2, user: student2, completed_at: Time.current)

        expect(district.vitally_data[:traits]).to include(
          diagnostics_completed_this_year: 2
        )
      end

      it 'should not count activity_sessions for non-diagnostic activities' do
        classification = create(:connect)
        diagnostic.update(classification: classification)

        expect(district.vitally_data[:traits]).to include(
          diagnostics_completed_this_year: 0
        )
      end
    end

    context 'diagnostic completion percentage rollups' do

      it 'should calculate completion percentages' do
        student2 = create(:student, student_in_classroom: [classroom1])
        classroom_unit1 = create(:classroom_unit, classroom: classroom1, unit: unit, assigned_student_ids: [student1.id, student2.id])
        create(:activity_session, activity: diagnostic, classroom_unit: classroom_unit1, user: student1, completed_at: Time.current)

        expect(district.vitally_data[:traits]).to include(
          percent_diagnostics_completed_this_year: 0.5
        )
      end

      it 'should set the completion rate to 0.0 if no activities were assigned' do
        expect(district.vitally_data[:traits]).to include(
          percent_diagnostics_completed_this_year: 0.0
        )
      end
    end

    context 'subscription rollups' do
      let!(:subscription) { create(:subscription, districts: [district],
        payment_amount: 1800,
        stripe_invoice_id: 'in_12345678'
      ) }

      it 'pulls current subscription data' do
        expect(district.vitally_data[:traits]).to include(
          premium_start_date: subscription.start_date,
          premium_expiry_date: subscription.expiration,
          district_subscription: subscription.account_type,
          annual_revenue_current_contract: subscription.payment_amount,
          stripe_invoice_id_current_contract: subscription.stripe_invoice_id
        )
      end

      it 'pulls the latest expiration date when multiple subscriptions are active' do
        later_subscription = create(:subscription, districts: [district], start_date: subscription.start_date, expiration: subscription.expiration + 1.year)
        earlier_subscription = create(:subscription, districts: [district], start_date: subscription.start_date - 1.year, expiration: subscription.expiration + 10.days)

        expect(district.vitally_data[:traits][:premium_expiry_date]).to eq(later_subscription.expiration)
      end
    end
  end
end
