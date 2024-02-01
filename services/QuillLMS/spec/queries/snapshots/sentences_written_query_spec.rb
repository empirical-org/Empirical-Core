# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe SentencesWrittenQuery do
    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Activity Session Count CTE'

      it { expect(results).to eq(count: activities.sum(&:question_count)) }

      context 'no activity_sessions to count' do
        # we need a dummy ActivitySession unrelated to the filters so that BigQuery tests can infer the appropriate shape of the data
        let(:activity_sessions) { [create(:activity_session)] }

        it { expect(results).to eq(count: 0) }
      end
    end
  end
end
