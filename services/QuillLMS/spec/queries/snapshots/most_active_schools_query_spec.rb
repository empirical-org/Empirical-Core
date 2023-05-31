# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe MostActiveSchoolsQuery do
    include_context 'Snapshot Query Params'

    context 'external_api', :external_api do
      it 'should successfully get data' do
        result = described_class.run(timeframe_start, timeframe_end, school_ids, grades)

        expect(result).to eq([
          {"value" => "Wayne High School", "count" => 30320 }
        ])
      end
    end
  end
end
