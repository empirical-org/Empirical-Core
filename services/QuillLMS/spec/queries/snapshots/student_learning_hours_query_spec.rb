# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe 'StudentLearningHoursQuery' do
    context 'external_api', :external_api do
      it 'should successfully get data' do
        result = Snapshots::StudentLearningHoursQuery.run(4865604, '2023-01-01', '2023-05-01', [32628], [9,10,11,12])

        expect(result[:count]).to eq(4364.558333333333)
      end
    end
  end
end
