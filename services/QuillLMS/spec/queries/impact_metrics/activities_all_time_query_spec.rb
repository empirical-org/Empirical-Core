# frozen_string_literal: true

require 'rails_helper'

module ImpactMetrics
  describe ActivitiesAllTimeQuery do
    context 'for activities finished all time', :big_query_snapshot do
      include_context 'QuillBigQuery TestRunner Setup'

      let(:activity_sessions) { create_list(:activity_session, 20, :finished) }
      let(:unfinished_activity_sessions) { create_list(:activity_session, 10, :started) }
      let(:query_args) { {} }

      let(:cte_records) {
        [
          activity_sessions,
          unfinished_activity_sessions
        ]
      }

      it { expect(results).to eq [{ count: 20 }] }
    end
  end
end
