# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe StudentLearningHoursQuery do
    include_context 'Snapshot Query Params'

    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Count CTE'

      let(:total_timespent) { activity_sessions.sum(&:timespent) / 3600.0 }

      it { expect(results).to eq [{'count' => total_timespent }] }
    end
  end
end
