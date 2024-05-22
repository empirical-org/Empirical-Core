# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe ActivityPacksAssignedQuery do
    context 'big_query_snapshot', :big_query_snapshot do
      include_context 'Snapshots Period CTE'

      let(:num_activities) { 2 }
      let(:fake_assigned_student_ids) { [1, 2] }
      let(:activities) { create_list(:activity, num_activities) }
      let(:unit) { create(:unit, activities: activities) }
      let(:unit_activities) { unit.unit_activities }
      let(:classroom_units) { classrooms.map { |classroom| create(:classroom_unit, classroom: classroom, unit: unit, assigned_student_ids: fake_assigned_student_ids) } }

      let(:cte_records) do
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools_users,
          schools,
          activities,
          unit,
          unit_activities,
          classroom_units
        ]
      end

      it { expect(results).to eq(count: classrooms.length * fake_assigned_student_ids.length) }

      context 'with classroom_units created outside of timeframe' do
        before do
          classroom_units.each { |classroom_unit| classroom_unit.update(created_at: timeframe_start - 1.day) }
        end

        it { expect(results).to eq(count: 0) }
      end
    end
  end
end
