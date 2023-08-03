# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DiagnosticsOrganizedByClassroomFetcher do
  let(:user) { create(:teacher) }

  let!(:unit1) { create(:unit, user: user) }
  let!(:activity) { create(:diagnostic_activity) }
  let!(:unit_activity1) { create(:unit_activity, unit: unit1, activity: activity )}
  let!(:classroom) { create(:classroom) }
  let!(:classrooms_teacher) { create(:classrooms_teacher, classroom: classroom, user: user) }
  let!(:student1) { create(:student) }
  let!(:classroom_student1) { create(:students_classrooms, classroom: classroom, student: student1) }
  let!(:classroom_unit1) { create(:classroom_unit, unit: unit1, classroom: classroom, assigned_student_ids: [student1.id]) }
  let!(:date_before_question_switchover) { DateTime.new(2023, 7, 18, 0, 0, 0) }
  let!(:date_after_question_switchover) { DateTime.new(2023, 7, 20, 0, 0, 0) }

  subject { described_class.new(user, is_demo) }

  context "user is demo" do
    let(:is_demo) { true }

    describe 'record_with_aggregated_activity_sessions' do
      it 'should return the record with eligible_for_question_scoring = false' do
        expect(subject.record_with_aggregated_activity_sessions(activity.id, classroom.id)['eligible_for_question_scoring']).to eq(false)
      end
    end
  end

  context "user is not demo" do
    let(:is_demo) { false }

    describe 'record_with_aggregated_activity_sessions' do

      context 'there are no completed activity sessions' do
        it 'should return the record with eligible_for_question_scoring = true' do
          expect(subject.record_with_aggregated_activity_sessions(activity.id, classroom.id)['eligible_for_question_scoring']).to eq(true)
        end
      end

      context 'all activity sessions were completed after the question scoring switchover date' do
        let!(:activity_session) { create(:activity_session, user: student1, activity: activity, classroom_unit: classroom_unit1, completed_at: date_after_question_switchover)}

        it 'should return the record with eligible_for_question_scoring = true' do
          expect(subject.record_with_aggregated_activity_sessions(activity.id, classroom.id)['eligible_for_question_scoring']).to eq(true)
        end
      end

      context 'all activity sessions were completed before the question scoring switchover date' do
        let!(:activity_session) { create(:activity_session, user: student1, activity: activity, classroom_unit: classroom_unit1, completed_at: date_before_question_switchover)}

        it 'should return the record with eligible_for_question_scoring = false' do
          expect(subject.record_with_aggregated_activity_sessions(activity.id, classroom.id)['eligible_for_question_scoring']).to eq(false)
        end
      end

      context 'every student who completed an activity session for the given activity and classroom before the switchover also completed one after' do
        let!(:unit2) { create(:unit, user: user) }
        let!(:unit_activity2) { create(:unit_activity, unit: unit2, activity: activity )}
        let!(:classroom_unit2) { create(:classroom_unit, unit: unit2, classroom: classroom, assigned_student_ids: [student1.id]) }
        let!(:activity_session1) { create(:activity_session, user: student1, activity: activity, classroom_unit: classroom_unit1, completed_at: date_after_question_switchover)}
        let!(:activity_session2) { create(:activity_session, user: student1, activity: activity, classroom_unit: classroom_unit2, completed_at: date_before_question_switchover)}

        it 'should return the record with eligible_for_question_scoring = true' do
          expect(subject.record_with_aggregated_activity_sessions(activity.id, classroom.id)['eligible_for_question_scoring']).to eq(true)
        end
      end

      context 'not every student who completed an activity session for the given activity and classroom before the switchover also completed one after' do
        let!(:student2) { create(:student) }
        let!(:classroom_student2) { create(:students_classrooms, classroom: classroom, student: student2) }
        let!(:unit2) { create(:unit, user: user) }
        let!(:unit_activity2) { create(:unit_activity, unit: unit2, activity: activity )}
        let!(:classroom_unit2) { create(:classroom_unit, unit: unit2, classroom: classroom, assigned_student_ids: [student1.id, student2.id]) }
        let!(:activity_session1) { create(:activity_session, user: student1, activity: activity, classroom_unit: classroom_unit1, completed_at: date_after_question_switchover)}
        let!(:activity_session2) { create(:activity_session, user: student1, activity: activity, classroom_unit: classroom_unit2, completed_at: date_before_question_switchover)}
        let!(:activity_session3) { create(:activity_session, user: student2, activity: activity, classroom_unit: classroom_unit2, completed_at: date_before_question_switchover)}

        it 'should return the record with eligible_for_question_scoring = false' do
          expect(subject.record_with_aggregated_activity_sessions(activity.id, classroom.id)['eligible_for_question_scoring']).to eq(false)
        end
      end

    end
  end

end
