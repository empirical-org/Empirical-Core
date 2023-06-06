# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe TopConceptsPracticedQuery do
    include_context 'Snapshots TopX CTE'

    context 'external_api', :external_api do
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
          classroom_units,
        ]
      }

      it 'should successfully get data' do
        runner = QuillBigQuery::TestRunner.new([
          runner_context,
          activity_session_bundles
        ])

        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades, runner: runner)

        expect(result).to eq([
          {"count"=>activity_session_bundles[0].length, "value"=>concepts[0].name},
          {"count"=>activity_session_bundles[1].length, "value"=>concepts[1].name},
          {"count"=>activity_session_bundles[2].length, "value"=>concepts[2].name},
          {"count"=>activity_session_bundles[3].length, "value"=>concepts[3].name},
          {"count"=>activity_session_bundles[4].length, "value"=>concepts[4].name},
          {"count"=>activity_session_bundles[5].length, "value"=>concepts[5].name},
          {"count"=>activity_session_bundles[6].length, "value"=>concepts[6].name},
          {"count"=>activity_session_bundles[7].length, "value"=>concepts[7].name},
          {"count"=>activity_session_bundles[8].length, "value"=>concepts[8].name},
          {"count"=>activity_session_bundles[9].length, "value"=>concepts[9].name}
        ])
      end

      it 'should not include data from the 11th most common concept' do
        runner = QuillBigQuery::TestRunner.new([
          runner_context,
          activity_session_bundles
        ])
        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades, runner: runner)

        expect(result.map { |r| r['value'] }).not_to include(concepts[10].name)
      end

      it 'should count concepts in unit_activities outside of the timeframe' do
          too_old = create(:activity_session, activity: activities.first, classroom_unit: classroom_units.first, completed_at: timeframe_start - 1.day)
          too_new = create(:activity_session, activity: activities.first, classroom_unit: classroom_units.first, completed_at: timeframe_end + 1.day)

        runner = QuillBigQuery::TestRunner.new([
          runner_context,
          too_old,
          too_new
        ])
        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades, runner: runner)

        expect(result).to eq([])
      end
    end
  end
end
