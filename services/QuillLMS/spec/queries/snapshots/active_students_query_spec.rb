u# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe ActiveStudentsQuery do
    include_context 'Snapshot Query Params'

    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Count CTE'

      it { expect(results).to eq [{'count' => num_activity_sessions}] }

      context 'filters' do
        it_behaves_like 'snapshots period query with a timeframe', 1.day.ago, 1.hour.ago, [{'count' => 0}]
        it_behaves_like 'snapshots period query with a timeframe', 1.hour.from_now, 1.day.from_now, [{'count' => 0}]
        it_behaves_like 'snapshots period query with a timeframe', 1.hour.from_now, 1.day.ago, [{'count' => 0}]
        it_behaves_like 'snapshots period query with a different school id', [{'count' => 0 }]
      end
    end
  end
end
