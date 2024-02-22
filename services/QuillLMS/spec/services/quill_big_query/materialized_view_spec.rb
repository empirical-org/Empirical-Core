# frozen_string_literal: true

require 'rails_helper'

describe QuillBigQuery::MaterializedView do
  let(:query_key) { 'reporting_sessions_view' }
  let(:result) { described_class.fetch(query_key) }

  describe 'production config without stubs' do

    it 'should find SQL file' do
      expect {result}.not_to raise_error
    end
  end

  describe 'fetch' do
    before do
      stub_const('QuillBigQuery::MaterializedView::QUERY_FOLDER', Rails.root.join('spec/fixtures/sql/'))
    end

    it 'should return the expected payload' do
      expect(result.name).to eq('lms.recent_reporting_sessions_view')
      expect(result.sql).to eq("SELECT 2\n")
      expect(result.create_options).to be(nil)
    end

    context 'unknown key' do
      let(:query_key) {'some-unknown-key'}

      it 'should raise with unknown key' do
        expect {result}.to raise_error(QuillBigQuery::MaterializedView::InvalidQueryKeyError)
      end
    end
  end
end
