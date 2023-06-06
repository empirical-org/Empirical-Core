# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe MostActiveSchoolsQuery do
    include_context 'Snapshots TopX CTE'

    context 'big_query_snapshot', :big_query_snapshot do
      let(:num_classrooms) { 11 }
      let(:max_activity_session_count) { 20 }

      let(:classroom_units) { classrooms.map { |classroom| create(:classroom_unit, classroom: classroom) } }

      # For each classroom (each of which has a single classroom_unit), create activity_sessions for it, but creating one less for each subsequent classroom so that they'll have different relevant counts
      let(:activity_sessions) do
        classroom_units.map.with_index do |classroom_unit, i|
          create_list(:activity_session, (max_activity_session_count - i), classroom_unit: classroom_unit)
        end
      end

      let(:runner_context) {
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools,
          schools_users,
          classroom_units
        ]
      }

      it 'should include the top 10 results if they are present' do
        runner = QuillBigQuery::TestRunner.new([
          runner_context,
          activity_sessions
        ])
        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades, runner: runner)

        expect(result).to eq([
          {"value"=>schools[0].name, "count"=>activity_sessions[0].length },
          {"value"=>schools[1].name, "count"=>activity_sessions[1].length },
          {"value"=>schools[2].name, "count"=>activity_sessions[2].length },
          {"value"=>schools[3].name, "count"=>activity_sessions[3].length },
          {"value"=>schools[4].name, "count"=>activity_sessions[4].length },
          {"value"=>schools[5].name, "count"=>activity_sessions[5].length },
          {"value"=>schools[6].name, "count"=>activity_sessions[6].length },
          {"value"=>schools[7].name, "count"=>activity_sessions[7].length },
          {"value"=>schools[8].name, "count"=>activity_sessions[8].length },
          {"value"=>schools[9].name, "count"=>activity_sessions[9].length }
        ])
      end

      it 'should include fewer than 10 results if there are limited available results' do
        runner = QuillBigQuery::TestRunner.new([
          runner_context,
          activity_sessions[0]
        ])
        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades, runner: runner)

        expect(result).to eq([
          {"value" => schools[0].name, "count" => activity_sessions[0].length }
        ])
      end

      it 'should not include the 11th highest count' do
        runner = QuillBigQuery::TestRunner.new([
          runner_context,
          activity_sessions
        ])
        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades, runner: runner)

        expect(result.length).to eq(10)
        expect(result.map { |r| r["value"] }).not_to include(schools[10].name)
      end

      it 'should not count sessions outside of the timeframe' do
        too_old_session = create(:activity_session, classroom_unit: classroom_units[0], completed_at: timeframe_start - 1.day)
        too_new_session = create(:activity_session, classroom_unit: classroom_units[0], completed_at: timeframe_end + 1.day)

        runner = QuillBigQuery::TestRunner.new([
          runner_context,
          activity_sessions[0].first,
          too_old_session,
          too_new_session
        ])
        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades, runner: runner)

        expect(result).to eq([
          {"value" => schools[0].name, "count" => 1 }
        ])
      end

      it 'should not count unstarted or started-but-not-finished sessions' do
        # percentage has to be set for CTE to UNION these with items that have percentages set
        unstarted_session = create(:activity_session, :unstarted, classroom_unit: classroom_units[0], percentage: 0.0)
        started_session = create(:activity_session, :started, classroom_unit: classroom_units[0], percentage: 0.0)

        runner = QuillBigQuery::TestRunner.new([
          runner_context,
          activity_sessions[0].first,
          unstarted_session,
          started_session
        ])

        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades, runner: runner)

        expect(result).to eq([
          {"value" => schools[0].name, "count" => 1 }
        ])
      end
    end
  end
end
