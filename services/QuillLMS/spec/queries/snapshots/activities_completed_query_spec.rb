# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe ActivitiesCompletedQuery do
    include_context 'Snapshot Query Params'

    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Count CTE'

      let(:num_completed_activities) { activity_sessions.count }

      it { expect(results).to eq [{'count' => num_completed_activities }] }

      context 'unfinished activity sessions' do
        let(:activity_sessions) { classroom_units.map { |cu| create(:activity_session, :started, classroom_unit: cu) } }

        it { expect(results).to eq [{'count' => 0 }] }
      end

      context 'filters' do
        it_behaves_like 'snapshots period query with a timeframe', 1.day.ago, 1.hour.ago, [{'count' => 0}]
        it_behaves_like 'snapshots period query with a timeframe', 1.hour.from_now, 1.day.from_now, [{'count' => 0}]
        it_behaves_like 'snapshots period query with a timeframe', 1.hour.from_now, 1.day.ago, [{'count' => 0}]
        it_behaves_like 'snapshots period query with a different school id', [{'count' => 0 }]
      end
    end
  end
end
