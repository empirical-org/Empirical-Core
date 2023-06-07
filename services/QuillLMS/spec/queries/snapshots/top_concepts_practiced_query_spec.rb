# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe TopConceptsPracticedQuery do
    include_context 'Snapshots Period CTE'

    context 'big_query_snapshot', :big_query_snapshot do
      let(:num_classrooms) { 1 }
      let(:max_activity_session_count) { 11 }
      let(:num_concepts) { 11 }

      let(:concepts) { create_list(:concept, num_concepts) }
      let(:activities) { concepts.map { |concept| create(:activity, data: {modelConceptUID: concept.uid}) } }
      let(:classroom_units) { classrooms.map { |classroom| create(:classroom_unit, classroom: classroom) } }

      # We have one activity connected to each concept.
      # We want to create an activity_session for each activity, then a second activity_session for all but one activity, and so on.  The outcome we desire is a unique number of activity_sessions tied to each activity
      let(:activity_session_bundles) do
        activities.map.with_index do |activity, activity_index|
          create_list(:activity_session, num_concepts - activity_index, activity: activity, classroom_unit: classroom_units.first)
        end
      end

      let(:runner_context) {
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools,
          schools_users,
          concepts,
          activities,
          classroom_units
        ]
      }

      let(:runner) { QuillBigQuery::TestRunner.new(cte_records) }
      let(:results) { described_class.run(timeframe_start, timeframe_end, school_ids, grades, runner: runner) }

      context 'all activity_sessions' do
        let(:expected_result) do
          (0..9).map { |i| {"count"=>activity_session_bundles[i].length, "value"=>concepts[i].name} }
        end
        let(:cte_records) { [runner_context, activity_session_bundles] }

        it { expect(results).to eq(expected_result) }
        it { expect(results.map { |r| r['value'] }).not_to include(concepts[10].name) }
      end

      context 'activity_sessions completed outside of timeframe' do
        let(:too_old) { create(:activity_session, activity: activities.first, classroom_unit: classroom_units.first, completed_at: timeframe_start - 1.day) }
        let(:too_new) { create(:activity_session, activity: activities.first, classroom_unit: classroom_units.first, completed_at: timeframe_end + 1.day) }
        let(:cte_records) { [runner_context, too_old, too_new] }

        it { expect(results).to eq([]) }
      end
    end
  end
end
