# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe SentencesWrittenQuery do
    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Activity Session Count CTE'

      let(:concept_results) { activity_sessions.map { |activity_session| create(:concept_result, activity_session: activity_session) } }
      let(:cte_records) { count_query_cte_records << concept_results }

      it { expect(results).to eq(count: activities.sum(&:question_count)) }
    end
  end
end
