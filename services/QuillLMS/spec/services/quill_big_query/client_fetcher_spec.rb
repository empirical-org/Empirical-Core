# frozen_string_literal: true

require 'rails_helper'

describe QuillBigQuery::ClientFetcher do
  context 'integration', :external_api do
    around do |a_spec|
      VCR.configure { |c| c.allow_http_connections_when_no_cassette = true }
      a_spec.run
      VCR.configure { |c| c.allow_http_connections_when_no_cassette = false }
    end

    it 'should initializer multiple clients without error' do
      expect do
        2.times { QuillBigQuery::ClientFetcher.run }
      end.to_not raise_error
    end
  end
end
