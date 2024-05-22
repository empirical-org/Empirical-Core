# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe TopConceptsAssignedQuery do
    include_context 'Snapshots Period CTE'

    context 'big_query_snapshot', :big_query_snapshot do
      let(:num_classrooms) { 1 }
      let(:num_concepts) { 11 }

      let(:activity_category_activities) { create_list(:activity_category_activity, num_concepts) }
      let(:activity_categories) { activity_category_activities.map { |aca| aca.activity_category } }
      let(:activities) { activity_category_activities.map { |aca| aca.activity } }

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
          activity_categories,
          activities,
          activity_category_activities,
          classroom_units
        ]
      }

      let(:cte_records) { [runner_context, unit_activity_bundles] }

      context 'query LIMITs and shape' do
        let(:expected_result) do
          (0..9).map { |i| { count: unit_activity_bundles[i].length, value: activity_categories[i].name} }
        end

        it { expect(results).to eq(expected_result) }
      end

      context 'classroom_units created outside of timeframe' do
        before do
          classroom_units.each { |cu| cu.update(created_at: timeframe_start - 1.day) }
        end

        it { expect(results).to eq([]) }
      end
    end
  end
end
