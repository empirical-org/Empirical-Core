# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe SentencesWrittenQuery do
    include_context 'Snapshot Query Params'

    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Count CTE'

      let(:cte) do
        <<-SQL
          #{snapshots_count_cte},
          concept_results AS ( #{concept_results_cte_query} )
        SQL
      end

      it { p concept_results; expect(results).to eq [{'count' => concept_results.count }] }
    end
  end
end
