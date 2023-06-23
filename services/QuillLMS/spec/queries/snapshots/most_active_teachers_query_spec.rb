# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe MostActiveTeachersQuery do
    include_context 'Snapshots Period CTE'

    context 'big_query_snapshot', :big_query_snapshot do
      let(:num_classrooms) { 11 }

      let(:classroom_units) { classrooms.map { |classroom| create(:classroom_unit, classroom: classroom) } }

      # For each classroom (each of which has a single classroom_unit), create activity_sessions for it, but creating one less for each subsequent classroom so that they'll have different relevant counts
      let(:activity_sessions) do
        classroom_units.map.with_index do |classroom_unit, i|
          create_list(:activity_session, (num_classrooms - i), classroom_unit: classroom_unit)
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

      context 'all activity_sessions' do
        let(:expected_result) do
          (0..9).map { |i| {"value"=>teachers[i].name, "count"=>activity_sessions[i].length} }
        end
        let(:cte_records) { [runner_context, activity_sessions] }

        it { puts runner.send(:cte);expect(results).to eq(expected_result) }
      end

      context 'limited activity_sessions' do
        let(:cte_records) { [runner_context, activity_sessions[0]] }

        it { expect(results).to eq([{"value"=>teachers[0].name, "count"=>activity_sessions[0].length }]) }
      end

      context 'activity_sessions completed outsidee of timeframe' do
        let(:too_old_session) { create(:activity_session, classroom_unit: classroom_units[0], completed_at: timeframe_start - 1.day) }
        let(:too_new_session) { create(:activity_session, classroom_unit: classroom_units[0], completed_at: timeframe_end + 1.day) }

        let(:cte_records) { [runner_context, too_old_session, too_new_session] }

        it { expect(results).to eq([]) }
      end

      context 'unstarted and unfinished activity_sessions' do
        # percentage has to be set for CTE to UNION these with items that have percentages set
        let(:unstarted_session) { create(:activity_session, :unstarted, classroom_unit: classroom_units[0], percentage: 0.0) }
        let(:started_session) { create(:activity_session, :started, classroom_unit: classroom_units[0], percentage: 0.0) }

        let(:cte_records) { [runner_context, unstarted_session, started_session] }

        it { expect(results).to eq([]) }
      end
    end
  end
end
