# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe ActivitiesAssignedQuery do
    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Period CTE'

      let(:runner_context) do
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools_users,
          schools
        ]
      end

      # Note that we're setting assigned_student_ids to an arbitrary one-length array because we don't actually need to reference the students in question, so any number "works" here.
      let(:classroom_units) { classrooms.map { |classroom| create(:classroom_unit, classroom: classroom, assigned_student_ids: [1]) } }
      let(:unit_activities) { classroom_units.map { |classroom_unit| create(:unit_activity, unit: classroom_unit.unit) } }
      let(:cte_records) { [runner_context, classroom_units, unit_activities] }

      let(:num_activities_assigned) { unit_activities.count }

      it "should do a test" do
        expect(results).to eq(count: num_activities_assigned)
      end
    end
  end
end
