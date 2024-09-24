# frozen_string_literal: true

require 'rails_helper'

describe VitallyIntegration::SerializeVitallySalesOrganization do
  before do
    create(:evidence)
    create(:activity_classification, key: ActivityClassification::DIAGNOSTIC_KEY)
  end

  context '#data' do
    let!(:district) { create(:district) }
    let!(:school1) { create(:school, district: district) }
    let!(:teacher1) { create(:teacher, school: school1) }
    let!(:classroom1) { create(:classroom) }
    let!(:classroom_teacher1) { create(:classrooms_teacher, user: teacher1, classroom: classroom1, role: 'owner') }
    let!(:student1) { create(:student, student_in_classroom: [classroom1]) }
    let!(:student2) { create(:student, student_in_classroom: [classroom1]) }
    let!(:diagnostic) { create(:diagnostic_activity) }
    let!(:unit) { create(:unit, activities: [diagnostic]) }

    it 'should return vitally payload with correct data when no diagnostics or evidence activities have been assigned' do
      expect(described_class.new(district).data).to eq({
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
          evidence_activities_assigned_all_time: 0,
          evidence_activities_assigned_this_year: 0,
          evidence_activities_assigned_last_year: 0,
          evidence_activities_completed_all_time: 0,
          evidence_activities_completed_this_year: 0,
          evidence_activities_completed_last_year: 0,
          evidence_activities_completed_per_student_this_year: 0,
          evidence_activities_completed_per_student_last_year: 0,
          percent_diagnostics_completed_this_year: 0.0,
          percent_diagnostics_completed_last_year: 0.0,
          earliest_premium_start_date: described_class::VITALLY_NOT_APPLICABLE,
          current_premium_start_date: described_class::VITALLY_NOT_APPLICABLE,
          premium_expiry_date: described_class::VITALLY_NOT_APPLICABLE,
          district_subscription: described_class::VITALLY_NOT_APPLICABLE,
          total_premium_months: 0,
          annual_revenue_current_contract: described_class::VITALLY_NOT_APPLICABLE,
          stripe_invoice_id_current_contract: described_class::VITALLY_NOT_APPLICABLE,
          purchase_order_number_current_contract: described_class::VITALLY_NOT_APPLICABLE,
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
        expect(described_class.new(district).data[:traits]).to include(
          diagnostics_assigned_this_year: 2,
          diagnostics_completed_this_year: 0,
          diagnostics_assigned_last_year: 0
        )
      end

      it 'should roll up diagnostic data when diagnostics are assigned last year' do
        classroom_unit.update(created_at: 1.year.ago)

        expect(described_class.new(district).data[:traits]).to include(
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

        expect(described_class.new(district).data[:traits]).to include(
          diagnostics_assigned_this_year: 4
        )
      end

      it 'should ignore assigned activities that are not diagnostics' do
        classification = create(:connect)
        diagnostic.update(classification: classification)

        expect(described_class.new(district).data[:traits]).to include(
          diagnostics_assigned_last_year: 0
        )
      end

      it 'should roll up data for archived classrooms' do
        classroom2 = create(:classroom, visible: false)
        create(:classrooms_teacher, user: teacher1, classroom: classroom2)
        student3 = create(:student)
        create(:classroom_unit, classroom: classroom2, unit: unit, assigned_student_ids: [student2.id, student3.id])

        expect(described_class.new(district).data[:traits]).to include(
          diagnostics_assigned_this_year: 4
        )
      end
    end

    context 'diagnostic completion rollups' do
      let!(:classroom_unit) { create(:classroom_unit, classroom: classroom1, unit: unit, assigned_student_ids: [student1.id, student2.id]) }
      let!(:activity_session1) { create(:activity_session, activity: diagnostic, classroom_unit: classroom_unit, user: student1, completed_at: Time.current) }
      let!(:activity_session2) { create(:activity_session, activity: diagnostic, classroom_unit: classroom_unit, user: student2, completed_at: Time.current) }

      it 'should roll up diagnostic completions this year' do
        expect(described_class.new(district).data[:traits]).to include(
          diagnostics_completed_this_year: 2,
          diagnostics_completed_last_year: 0
        )
      end

      it 'should roll up diagnostic completions from last year' do
        activity_session1.update(completed_at: 1.year.ago)
        activity_session2.update(completed_at: 1.year.ago)

        expect(described_class.new(district).data[:traits]).to include(
          diagnostics_completed_this_year: 0,
          diagnostics_completed_last_year: 2
        )
      end

      it 'should not count activity_session records that are not completed' do
        activity_session1.update(completed_at: nil, state: 'started')
        activity_session2.update(completed_at: nil, state: 'started')

        expect(described_class.new(district).data[:traits]).to include(
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

        expect(described_class.new(district).data[:traits]).to include(
          diagnostics_completed_this_year: 3
        )
      end

      it 'should not count activity_sessions for non-diagnostic activities' do
        classification = create(:connect)
        diagnostic.update(classification: classification)

        expect(described_class.new(district).data[:traits]).to include(
          diagnostics_completed_this_year: 0
        )
      end
    end

    context 'diagnostic completion percentage rollups' do
      it 'should calculate completion percentages' do
        student2 = create(:student, student_in_classroom: [classroom1])
        classroom_unit1 = create(:classroom_unit, classroom: classroom1, unit: unit, assigned_student_ids: [student1.id, student2.id])
        create(:activity_session, activity: diagnostic, classroom_unit: classroom_unit1, user: student1, completed_at: Time.current)

        expect(described_class.new(district).data[:traits]).to include(
          percent_diagnostics_completed_this_year: 0.5
        )
      end

      it 'should set the completion rate to 0.0 if no activities were assigned' do
        expect(described_class.new(district).data[:traits]).to include(
          percent_diagnostics_completed_this_year: 0.0
        )
      end
    end

    context 'evidence rollups' do
      before do
        teacher = create(:user, role: 'teacher')
        teacher_two = create(:user, role: 'teacher')
        create(:schools_users, school: school1, user: teacher)
        school2 = create(:school, district: district)
        create(:schools_users, school: school2, user: teacher_two)
        student = create(:user, role: 'student')
        student_two = create(:user, role: 'student')
        student_three = create(:user, role: 'student')

        classroom = create(:classroom)
        classroom_two = create(:classroom, visible: false)
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
          completed_at: middle_of_school_year - 10.days)
        create(:activity_session,
          classroom_unit: classroom_unit_two,
          activity: evidence_unit_activity_two.activity,
          user: student_three,
          state: 'finished',
          completed_at: middle_of_school_year - 10.days)
        create(:activity_session,
          classroom_unit: classroom_unit,
          activity: evidence_unit_activity.activity,
          user: student,
          state: 'finished',
          completed_at: middle_of_school_year - 3.days)
        create(:activity_session,
          classroom_unit: classroom_unit,
          activity: evidence_unit_activity.activity,
          user: student,
          state: 'finished',
          completed_at: middle_of_school_year - 5.days)
        create(:activity_session,
          classroom_unit: classroom_unit,
          activity: evidence_unit_activity.activity,
          user: student_two,
          state: 'finished',
          created_at: middle_of_school_year - 1.year,
          completed_at: middle_of_school_year - 1.year)
        create(:activity_session,
          classroom_unit: classroom_unit,
          activity: evidence_unit_activity.activity,
          user: student_two,
          state: 'started',
          created_at: middle_of_school_year - 1.year,
          completed_at: middle_of_school_year - 1.year)
      end

      it 'should roll up evidence assignments this year and last year and all time' do
        expect(described_class.new(district).data[:traits]).to include(
          evidence_activities_assigned_all_time: 3,
          evidence_activities_assigned_this_year: 3,
          evidence_activities_assigned_last_year: 0
        )
      end

      it 'should roll up evidence completions this year and last year and all time' do
        expect(described_class.new(district).data[:traits]).to include(
          evidence_activities_completed_all_time: 5,
          evidence_activities_completed_this_year: 4,
          evidence_activities_completed_last_year: 1
        )
      end

      it 'should roll up evidence completions per student this year and last year and all time' do
        expect(described_class.new(district).data[:traits]).to include(
          evidence_activities_completed_per_student_this_year: 2,
          evidence_activities_completed_per_student_last_year: 1
        )
      end
    end

    context 'subscription rollups' do
      let!(:subscription) {
        create(:subscription,
          districts: [district],
          payment_amount: 1800,
          stripe_invoice_id: 'in_12345678',
          purchase_order_number: 'PO-1234')
      }

      let!(:old_subscription) {
        create(:subscription,
          districts: [district],
          expiration: Time.zone.today - 1.year,
          start_date: Time.zone.today - 2.years)
      }

      it 'pulls current subscription data' do
        expect(described_class.new(district).data[:traits]).to include(
          earliest_premium_start_date: old_subscription.start_date,
          current_premium_start_date: subscription.start_date,
          premium_expiry_date: subscription.expiration,
          total_premium_months: subscription.length_in_months + old_subscription.length_in_months,
          district_subscription: subscription.account_type,
          annual_revenue_current_contract: subscription.payment_amount,
          stripe_invoice_id_current_contract: subscription.stripe_invoice_id,
          purchase_order_number_current_contract: subscription.purchase_order_number
        )
      end

      it 'pulls the latest expiration date when multiple subscriptions are active' do
        later_subscription = create(:subscription, districts: [district], start_date: subscription.start_date, expiration: subscription.expiration + 1.year)
        earlier_subscription = create(:subscription, districts: [district], start_date: subscription.start_date - 1.year, expiration: subscription.expiration + 10.days)

        expect(described_class.new(district).data[:traits][:premium_expiry_date]).to eq(later_subscription.expiration)
      end
    end

    describe '#activities_and_students_rollups' do
      let!(:classroom_unit) { create(:classroom_unit, classroom: classroom1, unit: unit, assigned_student_ids: [student1.id, student2.id]) }
      let!(:connect_activity) { create(:connect_activity) }
      let!(:last_school_year) { Time.zone.today - 1.year }
      let!(:session1) { create(:activity_session, state: 'finished', completed_at: Time.current, user: student1, classroom_unit: classroom_unit, activity: diagnostic) }
      let!(:session2) { create(:activity_session, state: 'finished', completed_at: Time.current, user: student2, classroom_unit: classroom_unit, activity: diagnostic) }
      let!(:session3) { create(:activity_session, state: 'finished', completed_at: last_school_year, user: student2, classroom_unit: classroom_unit, activity: diagnostic) }
      let!(:session4) { create(:activity_session, state: 'finished', completed_at: last_school_year, user: student1, classroom_unit: classroom_unit, activity: diagnostic) }
      let!(:session5) { create(:activity_session, state: 'finished', completed_at: last_school_year, user: student1, classroom_unit: classroom_unit, activity: connect_activity) }
      let!(:session6) { create(:activity_session, state: 'started', completed_at: Time.current, user: student2, classroom_unit: classroom_unit, activity: diagnostic) }

      let!(:other_district_student) { create(:student) }
      let!(:session7) { create(:activity_session, state: 'finished', completed_at: Time.current, user: other_district_student) }

      it 'gets the last sign in date of the most recent student' do
        last_active = Time.zone.today - 1.month
        student1.update(last_sign_in: last_active)
        student2.update(last_sign_in: Time.zone.today - 1.year)

        expect(described_class.new(district).data[:traits][:last_active_time]).to eq(last_active)
      end

      context 'gets the number of activites completed' do
        it 'in this school year' do
          expect(described_class.new(district).data[:traits][:activities_completed_this_year]).to eq(2)
        end

        it 'in the previous school year' do
          expect(described_class.new(district).data[:traits][:activities_completed_last_year]).to eq(3)
        end

        it 'for all time' do
          expect(described_class.new(district).data[:traits][:activities_completed_all_time]).to eq(5)
        end
      end

      context 'gets the number of activites completed per student' do
        it 'in this school year' do
          expect(described_class.new(district).data[:traits][:activities_completed_per_student_this_year]).to eq(1.0)
        end

        it 'in the previous school year' do
          expect(described_class.new(district).data[:traits][:activities_completed_per_student_last_year]).to eq(1.5)
        end

        it 'for all time' do
          expect(described_class.new(district).data[:traits][:activities_completed_per_student_all_time]).to eq(2.5)
        end
      end

      context 'gets the number of active students' do
        it 'in this school year' do
          expect(described_class.new(district).data[:traits][:active_students_this_year]).to eq(2)
        end

        it 'in the previous school year' do
          expect(described_class.new(district).data[:traits][:active_students_last_year]).to eq(2)
        end

        it 'for all time' do
          expect(described_class.new(district).data[:traits][:active_students_all_time]).to eq(2)
        end
      end

      context 'includes archived classrooms in the roundup' do
        before do
          classroom1.update(visible: false)
        end

        it 'activities completed all time' do
          expect(described_class.new(district).data[:traits][:activities_completed_all_time]).to eq(5)
        end

        it 'activities completed per student all time' do
          expect(described_class.new(district).data[:traits][:activities_completed_per_student_all_time]).to eq(2.5)
        end

        it 'active students all time' do
          expect(described_class.new(district).data[:traits][:active_students_all_time]).to eq(2)
        end
      end

      context 'excludes classrooms where teacher is coteacher' do
        before do
          classroom_teacher1.update(role: 'coteacher')
        end

        it 'activities completed all time' do
          expect(described_class.new(district).data[:traits][:activities_completed_all_time]).to eq(0)
        end

        it 'activities completed per student all time' do
          expect(described_class.new(district).data[:traits][:activities_completed_per_student_all_time]).to eq(0)
        end

        it 'active students all time' do
          expect(described_class.new(district).data[:traits][:active_students_all_time]).to eq(0)
        end
      end
    end
  end

  context 'benchmarking', :benchmarking do
    let!(:district) { create(:district) }
    let!(:connect_activity) { create(:connect_activity) }
    let!(:last_school_year) { Time.zone.today - 1.year }
    let!(:schools) { create_list(:school, 80, district: district) }

    it 'run benchmarking on a district with 80 schools and 10000 activities' do
      schools.each do |school|
        teacher = create(:teacher, school: school)
        classroom = create(:classroom)
        classroom_teacher = create(:classrooms_teacher, user: teacher, classroom: classroom)
        diagnostic = create(:diagnostic_activity)
        unit = create(:unit, activities: [diagnostic])
        students = create_list(:student, 25, student_in_classroom: [classroom], last_sign_in: Time.zone.today)
        classroom_unit = create(:classroom_unit, classroom: classroom, unit: unit, assigned_student_ids: students.map(&:id))
        students.each do |student|
          create_list(:activity_session, 5, state: 'finished', completed_at: Time.current, user: student, classroom_unit: classroom_unit, activity: diagnostic)
        end
      end

      runtime = Benchmark.realtime { expect(described_class.new(district).active_students).to eq(2000) }
      puts format('Average runtime for active students all time: %<runtime>.3f seconds', { runtime: runtime })

      runtime = Benchmark.realtime { expect(described_class.new(district).active_students(Time.zone.today - 1.year)).to eq(2000) }
      puts format('Average runtime for active students this year: %<runtime>.3f seconds', { runtime: runtime })

      runtime = Benchmark.realtime { expect(described_class.new(district).active_students(Time.zone.today - 2.years, Time.zone.today - 1.year)).to eq(0) }
      puts format('Average runtime for active students last year: %<runtime>.3f seconds', { runtime: runtime })

      runtime = Benchmark.realtime { expect(described_class.new(district).activities_completed).to eq(10000) }
      puts format('Average runtime for activities completed all time: %<runtime>.3f seconds', { runtime: runtime })

      runtime = Benchmark.realtime { expect(described_class.new(district).activities_completed(Time.zone.today - 1.year)).to eq(10000) }
      puts format('Average runtime for activities completed this year: %<runtime>.3f seconds', { runtime: runtime })

      runtime = Benchmark.realtime { expect(described_class.new(district).activities_completed(Time.zone.today - 2.years, Time.zone.today - 1.year)).to eq(0) }
      puts format('Average runtime for activities completed last year: %<runtime>.3f seconds', { runtime: runtime })

      runtime = Benchmark.realtime { expect(described_class.new(district).last_active_time).to eq(Time.zone.today) }
      puts format('Average runtime for last sign in: %<runtime>.3f seconds', { runtime: runtime })
    end
  end
end
