# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe TopConceptsAssignedQuery do
    include_context 'Snapshot Query Params'

    context 'external_api', :external_api do
      it 'should successfully get data' do
        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades)

        expect(result).to eq([
          {"value" => "Comma Before Coordinating Conjunctions", "count" => 3777 },
          {"value" => "Compound Objects", "count" => 3339 },
          {"value" => "Subordinating Conjunction at the Beginning of a Sentence", "count" => 2232 }
        ])
      end
    end
  end
end
