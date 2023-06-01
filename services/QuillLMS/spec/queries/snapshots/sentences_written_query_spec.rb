# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe SentencesWrittenQuery do
    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Count CTE'

      let(:concept_results) { activity_sessions.map { |activity_session| create(:concept_result, activity_session: activity_session) } }
      let(:cte_table_collections) { count_query_cte_table_collections << concept_results }

      it { expect(results).to eq [{'count' => concept_results.count }] }
    end
  end
end
