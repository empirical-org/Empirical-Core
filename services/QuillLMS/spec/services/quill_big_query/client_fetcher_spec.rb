# frozen_string_literal: true

require 'rails_helper'

describe QuillBigQuery::ClientFetcher do
  context 'integration', :external_api do
    it 'should initializer multiple clients without error' do
      expect do
        2.times { QuillBigQuery::ClientFetcher.run }
      end.to_not raise_error
    end
  end
end
