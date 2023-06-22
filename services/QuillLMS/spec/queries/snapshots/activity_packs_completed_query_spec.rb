# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe ActivityPacksCompletedQuery do
    context 'big_query_snapshot', :big_query_snapshot do
      include_context 'Snapshots Activity Session Count CTE'

      let(:unit_activities) { classroom_units.map { |classroom_unit| create(:unit_activity, unit: classroom_unit.unit) } }

      let(:cte_records) do
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools_users,
          schools,
          activity_sessions,
          classroom_units,
          unit_activities
        ]
      end

      it { expect(results).to eq(count: classroom_units.length) }

      context 'when a student has not started activities' do
        # Our query requires at least one activity session to be in the database,
        # but the one we create here is unrelated to any of our other data
        let(:activity_sessions) { create(:activity_session) }

        it { expect(results).to eq(count: 0) }
      end

      context 'with classroom_units created outside of timeframe' do
        before do
          activity_sessions.each { |activity_session| activity_session.update(completed_at: timeframe_start - 1.day) }
        end

        it { expect(results).to eq(count: 0) }
      end
    end
  end
end
