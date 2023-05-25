# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe 'AverageActivitiesCompletedPerStudentQuery' do
    include_context 'Snapshot Query Params'

    context 'external_api', :external_api do
      it 'should successfully get data' do
        result = Snapshots::AverageActivitiesCompletedPerStudentQuery.run(timeframe_start, timeframe_end, school_ids, grades)

        expect(result[:count]).to eq(41.534246575342465)
      end
    end
  end
end
