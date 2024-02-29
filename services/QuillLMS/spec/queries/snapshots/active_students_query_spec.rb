# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe ActiveStudentsQuery do
    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Activity Session Count CTE'

      let(:num_active_students) { activity_sessions.map(&:user_id).uniq.count }

      it { expect(results).to eq(count: num_active_students) }

      context 'filters' do
        it_behaves_like 'snapshots period query with a timeframe', 2.day.ago.to_date, 1.day.ago.to_date, count: 0
        it_behaves_like 'snapshots period query with a different school id', count: 0
      end
    end
  end
end
