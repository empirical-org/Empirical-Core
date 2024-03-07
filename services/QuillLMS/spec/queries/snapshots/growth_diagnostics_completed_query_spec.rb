# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe GrowthDiagnosticsCompletedQuery do
    context 'big_query_snapshot', :big_query_snapshot do
      include_context 'Snapshots Activity Session Count CTE'

      let(:activity) { create(:activity) }
      let(:activity_sessions) do
        classroom_units.map do |classroom_unit|
          create(:activity_session, classroom_unit: classroom_unit, timespent: rand(1..100), activity: activity)
        end
      end

      let(:cte_records) do
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools_users,
          schools,
          classroom_units,
          activity_sessions,
          activities,
          users
        ]
      end

      before do
        stub_const("#{described_class}::GROWTH_DIAGNOSTIC_IDS", growth_diagnostic_ids)
      end

      context 'when completed activity is a baseline diagnostic' do
        let(:growth_diagnostic_ids) { [activity.id] }

        it { expect(results).to eq(count: activity_sessions.length) }

        context 'with activities completed outside of timeframe' do
          before do
            activity_sessions.each { |activity_session| activity_session.update(completed_at: timeframe_start - 1.day) }
          end

          it { expect(results).to eq(count: 0) }
        end
      end

      context 'when completed activity is not a baseline diagnostic' do
        # Set our IDs list to something that doesn't match our activity
        let(:growth_diagnostic_ids) { [activity.id + 1] }

        it { expect(results).to eq(count: 0) }
      end
    end
  end
end
