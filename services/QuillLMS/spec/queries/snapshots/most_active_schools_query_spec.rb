# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe MostActiveSchoolsQuery do
    include_context 'Snapshots TopX CTE'

    context 'external_api', :external_api do
      let(:num_classrooms) { 4 }
      let(:classrooms) { create_list(:classroom, num_classrooms) }
      let(:teachers) { classrooms.map(&:teachers).flatten }
      let(:schools) { teachers.map(&:school) }
      let(:classroom_units) { classrooms.map { |classroom| create(:classroom_unit, classroom: classroom) } }
      let(:first_school_relevant_session_count) { 10 }
      let(:second_school_relevant_session_count) { 7 }
      let(:third_school_relevant_session_count) { 5 }
      let(:fourth_school_relevant_session_count) { 1 }

      let(:first_school_relevant_sessions) { create_list(:activity_session, first_school_relevant_session_count, classroom_unit: classroom_units[0]) }
      let(:second_school_relevant_sessions) { create_list(:activity_session, second_school_relevant_session_count, classroom_unit: classroom_units[1]) }
      let(:third_school_relevant_sessions) { create_list(:activity_session, third_school_relevant_session_count, classroom_unit: classroom_units[2]) }
      let(:fourth_school_relevant_sessions) { create_list(:activity_session, fourth_school_relevant_session_count, classroom_unit: classroom_units[3]) }

      let(:runner_context) {
        [
          classrooms,
          teachers,
          teachers.map(&:classrooms_teachers),
          schools,
          schools.map(&:schools_users),
          classroom_units
        ]
      }

      it 'should include the top 3 results if they are present' do
        runner = QuillBigQuery::TestRunner.new([
          runner_context,
          first_school_relevant_sessions,
          second_school_relevant_sessions,
          third_school_relevant_sessions,
        ])
        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades, runner: runner)

        expect(result).to eq([
          {"value" => schools[0].name, "count" => first_school_relevant_session_count },
          {"value" => schools[1].name, "count" => second_school_relevant_session_count },
          {"value" => schools[2].name, "count" => third_school_relevant_session_count }
        ])
      end

      it 'should include fewer than 3 results if there are limited available results' do
        runner = QuillBigQuery::TestRunner.new([
          runner_context,
          first_school_relevant_sessions
        ])
        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades, runner: runner)

        expect(result).to eq([
          {"value" => schools[0].name, "count" => first_school_relevant_session_count }
        ])
      end

      it 'should not include the fourth highest count' do
        runner = QuillBigQuery::TestRunner.new([
          runner_context,
          first_school_relevant_sessions,
          second_school_relevant_sessions,
          third_school_relevant_sessions,
          fourth_school_relevant_sessions,
        ])
        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades, runner: runner)

        expect(result).not_to include(
          {"value" => schools[3].name, "count" => fourth_school_relevant_session_count }
        )
      end

      it 'should not count sessions outside of the timeframe' do
        too_old_session = create(:activity_session, classroom_unit: classroom_units[0], completed_at: timeframe_start - 1.day)
        too_new_session = create(:activity_session, classroom_unit: classroom_units[0], completed_at: timeframe_end + 1.day)
        
        runner = QuillBigQuery::TestRunner.new([
          runner_context,
          first_school_relevant_sessions,
          too_old_session,
          too_new_session
        ])
        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades, runner: runner)

        expect(result).to eq([
          {"value" => schools[0].name, "count" => first_school_relevant_session_count }
        ])
      end

      it 'should not count unstarted or started-but-not-finished sessions' do
        # percentage has to be set for CTE to UNION these with items that have percentages set
        unstarted_session = create(:activity_session, :unstarted, classroom_unit: classroom_units[0], percentage: 0.0)
        started_session = create(:activity_session, :started, classroom_unit: classroom_units[0], percentage: 0.0)

        runner = QuillBigQuery::TestRunner.new([
          runner_context,
          first_school_relevant_sessions,
          unstarted_session,
          started_session
        ])

        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades, runner: runner)

        expect(result).to eq([
          {"value" => schools[0].name, "count" => first_school_relevant_session_count }
        ])
      end
    end
  end
end
