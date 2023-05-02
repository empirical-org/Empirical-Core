# frozen_string_literal: true

require 'rails_helper'

describe 'SerializeVitallySalesOrganization' do

  context '#data' do
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
      expect(SerializeVitallySalesOrganization.new(district).data).to eq({
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
          percent_diagnostics_completed_this_year: 0.0,
          percent_diagnostics_completed_last_year: 0.0,
          premium_start_date: SerializeVitallySalesOrganization::VITALLY_NOT_APPLICABLE,
          premium_expiry_date: SerializeVitallySalesOrganization::VITALLY_NOT_APPLICABLE,
          district_subscription: SerializeVitallySalesOrganization::VITALLY_NOT_APPLICABLE,
          annual_revenue_current_contract: SerializeVitallySalesOrganization::VITALLY_NOT_APPLICABLE,
          stripe_invoice_id_current_contract: SerializeVitallySalesOrganization::VITALLY_NOT_APPLICABLE,
          purchase_order_number_current_contract: SerializeVitallySalesOrganization::VITALLY_NOT_APPLICABLE,
          active_students_this_year: 0,
          active_students_last_year: 0,
          active_students_all_time: 0,
          activities_completed_this_year: 0,
          activities_completed_last_year: 0,
          activities_completed_all_time: 0,
          activities_completed_per_student_this_year: 0,
          activities_completed_per_student_last_year: 0,
          activities_completed_per_student_all_time: 0,
          last_active_time: nil,
        }
      })
    end

    context 'diagnostic assignment rollups' do
      let!(:classroom_unit) { create(:classroom_unit, classroom: classroom1, unit: unit, assigned_student_ids: [student1.id, student2.id]) }

      it 'should roll up diagnostic data when diagnostics are assigned, but not completed' do
        expect(SerializeVitallySalesOrganization.new(district).data[:traits]).to include(
          diagnostics_assigned_this_year: 2,
          diagnostics_completed_this_year: 0,
          diagnostics_assigned_last_year: 0
        )
      end

      it 'should roll up diagnostic data when diagnostics are assigned last year' do
        classroom_unit.update(created_at: 1.year.ago)

        expect(SerializeVitallySalesOrganization.new(district).data[:traits]).to include(
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

        expect(SerializeVitallySalesOrganization.new(district).data[:traits]).to include(
          diagnostics_assigned_this_year: 4
        )
      end

      it 'should ignore assigned activities that are not diagnostics' do
        classification = create(:connect)
        diagnostic.update(classification: classification)

        expect(SerializeVitallySalesOrganization.new(district).data[:traits]).to include(
          diagnostics_assigned_last_year: 0
        )
      end
    end

    context 'diagnostic completion rollups' do
      let!(:classroom_unit) { create(:classroom_unit, classroom: classroom1, unit: unit, assigned_student_ids: [student1.id, student2.id]) }
      let!(:activity_session1) { create(:activity_session, activity: diagnostic, classroom_unit: classroom_unit, user: student1, completed_at: Time.current) }

      it 'should roll up diagnostic completions this year' do
        expect(SerializeVitallySalesOrganization.new(district).data[:traits]).to include(
          diagnostics_completed_this_year: 1,
          diagnostics_completed_last_year: 0
        )
      end

      it 'should roll up diagnostic completions from last year' do
        activity_session1.update(completed_at: 1.year.ago)

        expect(SerializeVitallySalesOrganization.new(district).data[:traits]).to include(
          diagnostics_completed_this_year: 0,
          diagnostics_completed_last_year: 1
        )
      end

      it 'should not count activity_session records that are not completed' do
        activity_session1.update(completed_at: nil, state: 'started')

        expect(SerializeVitallySalesOrganization.new(district).data[:traits]).to include(
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

        expect(SerializeVitallySalesOrganization.new(district).data[:traits]).to include(
          diagnostics_completed_this_year: 2
        )
      end

      it 'should not count activity_sessions for non-diagnostic activities' do
        classification = create(:connect)
        diagnostic.update(classification: classification)

        expect(SerializeVitallySalesOrganization.new(district).data[:traits]).to include(
          diagnostics_completed_this_year: 0
        )
      end
    end

    context 'diagnostic completion percentage rollups' do

      it 'should calculate completion percentages' do
        student2 = create(:student, student_in_classroom: [classroom1])
        classroom_unit1 = create(:classroom_unit, classroom: classroom1, unit: unit, assigned_student_ids: [student1.id, student2.id])
        create(:activity_session, activity: diagnostic, classroom_unit: classroom_unit1, user: student1, completed_at: Time.current)

        expect(SerializeVitallySalesOrganization.new(district).data[:traits]).to include(
          percent_diagnostics_completed_this_year: 0.5
        )
      end

      it 'should set the completion rate to 0.0 if no activities were assigned' do
        expect(SerializeVitallySalesOrganization.new(district).data[:traits]).to include(
          percent_diagnostics_completed_this_year: 0.0
        )
      end
    end

    context 'subscription rollups' do
      let!(:subscription) {
        create(:subscription,
          districts: [district],
          payment_amount: 1800,
          stripe_invoice_id: 'in_12345678',
          purchase_order_number: 'PO-1234'
        )
      }

      it 'pulls current subscription data' do
        expect(SerializeVitallySalesOrganization.new(district).data[:traits]).to include(
          premium_start_date: subscription.start_date,
          premium_expiry_date: subscription.expiration,
          district_subscription: subscription.account_type,
          annual_revenue_current_contract: subscription.payment_amount,
          stripe_invoice_id_current_contract: subscription.stripe_invoice_id,
          purchase_order_number_current_contract: subscription.purchase_order_number
        )
      end

      it 'pulls the latest expiration date when multiple subscriptions are active' do
        later_subscription = create(:subscription, districts: [district], start_date: subscription.start_date, expiration: subscription.expiration + 1.year)
        earlier_subscription = create(:subscription, districts: [district], start_date: subscription.start_date - 1.year, expiration: subscription.expiration + 10.days)

        expect(SerializeVitallySalesOrganization.new(district).data[:traits][:premium_expiry_date]).to eq(later_subscription.expiration)
      end
    end

    describe '#activities_and_students_rollups' do
      let!(:classroom_unit) {create(:classroom_unit, classroom: classroom1, unit: unit, assigned_student_ids: [student1.id, student2.id])}
      let!(:connect_activity) { create(:connect_activity) }
      let!(:session1) { create(:activity_session, state: 'finished', completed_at: Time.current, user: student1, classroom_unit: classroom_unit, activity: diagnostic)}
      let!(:session2) { create(:activity_session, state: 'finished', completed_at: Time.current, user: student2, classroom_unit: classroom_unit, activity: diagnostic)}
      let!(:session3) { create(:activity_session, state: 'finished', completed_at: Time.current - 1.year, user: student2, classroom_unit: classroom_unit, activity: diagnostic)}
      let!(:session4) { create(:activity_session, state: 'finished', completed_at: Time.current - 1.year, user: student1, classroom_unit: classroom_unit, activity: diagnostic)}
      let!(:session5) { create(:activity_session, state: 'finished', completed_at: Time.current - 1.year, user: student1, classroom_unit: classroom_unit, activity: connect_activity)}
      let!(:session6) { create(:activity_session, state: 'started', completed_at: Time.current, user: student2, classroom_unit: classroom_unit, activity: diagnostic)}

      let!(:other_district_student) { create(:student)}
      let!(:session7) { create(:activity_session, state: 'finished', completed_at: Time.current, user: other_district_student)}

      it 'gets the last sign in date of the most recent student' do
        last_active = Date.today - 1.month
        student1.update(last_sign_in: last_active)
        student2.update(last_sign_in: Date.today - 1.year)

        expect(SerializeVitallySalesOrganization.new(district).data[:traits][:last_active_time]).to eq(last_active)
      end

      context 'gets the number of activites completed' do

        it 'in this school year' do
          expect(SerializeVitallySalesOrganization.new(district).data[:traits][:activities_completed_this_year]).to eq(2)
        end

        it 'in the previous school year' do
          expect(SerializeVitallySalesOrganization.new(district).data[:traits][:activities_completed_last_year]).to eq(3)
        end

        it 'for all time' do
          expect(SerializeVitallySalesOrganization.new(district).data[:traits][:activities_completed_all_time]).to eq(5)
        end
      end

      context 'gets the number of activites completed per student' do

        it 'in this school year' do
          expect(SerializeVitallySalesOrganization.new(district).data[:traits][:activities_completed_per_student_this_year]).to eq(1.0)
        end

        it 'in the previous school year' do
          expect(SerializeVitallySalesOrganization.new(district).data[:traits][:activities_completed_per_student_last_year]).to eq(1.5)
        end

        it 'for all time' do
          expect(SerializeVitallySalesOrganization.new(district).data[:traits][:activities_completed_per_student_all_time]).to eq(2.5)
        end
      end

      context 'gets the number of active students' do

        it 'in this school year' do
          expect(SerializeVitallySalesOrganization.new(district).data[:traits][:active_students_this_year]).to eq(2)
        end

        it 'in the previous school year' do
          expect(SerializeVitallySalesOrganization.new(district).data[:traits][:active_students_last_year]).to eq(2)
        end

        it 'for all time' do
          expect(SerializeVitallySalesOrganization.new(district).data[:traits][:active_students_all_time]).to eq(2)
        end
      end
    end
  end
end
