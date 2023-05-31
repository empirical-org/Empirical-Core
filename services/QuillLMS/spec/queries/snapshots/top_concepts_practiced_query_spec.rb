# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe TopConceptsPracticedQuery do
    include_context 'Snapshot Query Params'

    context 'external_api', :external_api do
      it 'should successfully get data' do
        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades)

        expect(result).to eq([
          {"value" => "Compound Objects", "count" => 1787 },
          {"value" => "Comma Before Coordinating Conjunctions", "count" => 1744 },
          {"value" => "Subordinating Conjunction at the Beginning of a Sentence", "count" => 1196 }
        ])
      end
    end
  end
end
