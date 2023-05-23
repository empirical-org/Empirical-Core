# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe 'ActiveTeachersQuery' do
    context 'external_api', :external_api do
      before do
        VCR.configure { |c| c.allow_http_connections_when_no_cassette = true }
      end

      after do
        VCR.configure { |c| c.allow_http_connections_when_no_cassette = false }
      end

      it 'should successfully get data' do
        result = Snapshots::ActiveTeachersQuery.run(4865604, '2023-01-01', '2023-05-01', [32628], [9,10,11,12])

        expect(result[:count]).to eq(32)
      end
    end  
  end
end
