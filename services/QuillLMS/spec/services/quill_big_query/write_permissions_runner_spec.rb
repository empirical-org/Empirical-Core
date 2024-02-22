# frozen_string_literal: true

require 'rails_helper'

describe QuillBigQuery::WritePermissionsRunner do

  describe 'run' do
    let(:credentials) { {'a' => 1} }
    let(:query) {'SELECT 1 FROM lms.data'}
    let(:bq_double) { double(:query)}

    before do
      stub_const('QuillBigQuery::WritePermissionsRunner::CREDENTIALS', credentials.to_json)
    end

    subject { described_class.run(query)}

    it 'should call run properly' do
      expect(Google::Cloud::Bigquery).to receive(:new).with(credentials: credentials).and_return(bq_double)

      expect(bq_double).to receive(:query).with(query)

      subject
    end
  end
end
