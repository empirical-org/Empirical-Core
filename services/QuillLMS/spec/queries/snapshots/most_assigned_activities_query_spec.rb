# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe MostAssignedActivitiesQuery do
    include_context 'Snapshots Period CTE'

    context 'big_query_snapshot', :big_query_snapshot do
      let(:num_classrooms) { 11 }
      # Note that we're setting assigned_student_ids to an arbitrary one-length array because we don't actually need to reference the students in question, so any number "works" here.

      let(:assigned_student_ids) { [1] }

      let(:activities) { create_list(:activity, classrooms.length) }

      let(:classroom_units) { classrooms.map { |classroom| create(:classroom_unit, classroom: classroom, assigned_student_ids: assigned_student_ids) }.flatten }

      # We want to assign one activity to all classroom_units, the next activity to all but one, the next to all but two, and so on so that each activity is used a different number of times.
      let(:unit_activity_bundles) do
        classroom_units.map.with_index do |classroom_unit, classroom_unit_index|
          Array(0..(num_classrooms - (1 + classroom_unit_index))).map do |target_activity_index|
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
          activities,
          classroom_units
        ]
      }

      let(:cte_records) { [runner_context, unit_activity_bundles] }

      context 'query LIMITs and shape' do
        let(:expected_result) do
          (0..9).map { |i| {"count"=>unit_activity_bundles[i].length, "value"=>activities[i].name} }
        end

        it { expect(results).to eq(expected_result) }
      end

      context 'multiple students assigned to activities' do
        let(:assigned_student_ids) { [1, 2] }
        let(:expected_result) do
          (0..9).map { |i| {"count"=>unit_activity_bundles[i].length * assigned_student_ids.length, "value"=>activities[i].name} }
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
