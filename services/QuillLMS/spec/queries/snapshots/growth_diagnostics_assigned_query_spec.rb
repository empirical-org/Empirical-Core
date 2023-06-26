# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe GrowthDiagnosticsAssignedQuery do
    context 'big_query_snapshot', :big_query_snapshot do
      include_context 'Snapshots Period CTE'

      let(:assigned_student_ids) { [1,2,3] }
      let(:classroom_units) { classrooms.map { |classroom| create(:classroom_unit, classroom: classroom, assigned_student_ids: assigned_student_ids) } }
      let(:activity) { create(:activity) }
      let(:unit_activities) { classroom_units.map { |classroom_unit| create(:unit_activity, unit: classroom_unit.unit, activity: activity) } }

      let(:cte_records) do
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools_users,
          schools,
          classroom_units,
          unit_activities
        ]
      end

      before do
        stub_const("#{described_class}::GROWTH_DIAGNOSTIC_IDS", growth_diagnostic_ids)
      end

      context 'when assigned activity is a baseline diagnostic' do
        let(:growth_diagnostic_ids) { [activity.id] }

        it { expect(results).to eq(count: classroom_units.length * assigned_student_ids.length) }

        context 'with classroom_units created outside of timeframe' do
          before do
            classroom_units.each { |classroom_unit| classroom_unit.update(created_at: timeframe_start - 1.day) }
          end

          it { expect(results).to eq(count: 0) }
        end
      end

      context 'when assigned activity is not a baseline diagnostic' do
        # Set our IDs list to something that doesn't match our activity
        let(:growth_diagnostic_ids) { [activity.id + 1] }

        it { expect(results).to eq(count: 0) }
      end
    end
  end
end
