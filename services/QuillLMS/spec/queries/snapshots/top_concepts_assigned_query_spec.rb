# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe TopConceptsAssignedQuery do
    include_context 'Snapshots Period CTE'

    context 'big_query_snapshot', :big_query_snapshot do
      let(:num_classrooms) { 1 }
      let(:num_concepts) { 11 }

      let(:concepts) { create_list(:concept, num_concepts) }
      let(:activities) { concepts.map { |concept| create(:activity, data: {modelConceptUID: concept.uid}) } }
      # Note that we're setting assigned_student_ids to an arbitrary one-length array because we don't actually need to reference the students in question, so any number "works" here.
      let(:classroom_units) { classrooms.map { |classroom| create_list(:classroom_unit, num_concepts, classroom: classroom, assigned_student_ids: [1]) }.flatten }

      # We have one activity connected to each concept.
      # We have a number of classroom_units equal to the number of concepts.
      # We want to assign one concept to all classroom_units, the next concept to all but one, the next to all but two, and so on so that each concept is used a different number of times.
      let(:unit_activity_bundles) do
        classroom_units.map.with_index do |classroom_unit, classroom_unit_index|
          Array(0..(num_concepts - (1 + classroom_unit_index))).map do |target_activity_index|
            create(:unit_activity, activity: activities[target_activity_index], unit: classroom_unit.unit)
          end
        end
      end

      let(:runner_context) {
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools,
          schools_users,
          classroom_units,
          concepts,
          activities,
          classroom_units
        ]
      }

      it 'should successfully get data' do
        runner = QuillBigQuery::TestRunner.new([
          runner_context,
          unit_activity_bundles
        ])
        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades, runner: runner)

        expected_result = (0..9).map { |i| {"count"=>unit_activity_bundles[i].length, "value"=>concepts[i].name} }

        expect(result).to eq(expected_result)
      end

      it 'should not include data from the 11th most common concept' do
        runner = QuillBigQuery::TestRunner.new([
          runner_context,
          unit_activity_bundles
        ])
        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades, runner: runner)

        expect(result.map { |r| r['value'] }).not_to include(concepts[10].name)
      end

      it 'should count concepts in unit_activities outside of the timeframe' do
        classroom_units.each { |cu| cu.update(created_at: timeframe_start - 1.day) }

        runner = QuillBigQuery::TestRunner.new([
          runner_context,
          unit_activity_bundles
        ])
        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades, runner: runner)

        expect(result).to eq([])
      end
    end
  end
end
