# frozen_string_literal: true

require 'rails_helper'

describe QuillBigQuery::MaterializedViewDefinitions do
  let(:query_key) { 'reporting_sessions_view' }
  let(:result) { described_class.fetch(query_key) }

  describe 'production config without stubs' do

    it 'should find SQL file' do
      expect {result}.not_to raise_error
    end
  end

  describe 'fetch' do
    before do
      stub_const('QuillBigQuery::MaterializedViewDefinitions::QUERY_FOLDER', Rails.root.join('spec/fixtures/sql/'))
    end

    it 'should return the expected payload' do
      expect(result).to eq({
        name: 'lms.recent_reporting_sessions_view',
        sql: "SELECT 2\n",
        create_options: nil
      })
    end

    context 'unknown key' do
      let(:query_key) {'some-unknown-key'}

      it 'should raise with unknown key' do
        expect {result}.to raise_error(QuillBigQuery::MaterializedViewDefinitions::InvalidQueryKeyError)
      end
    end
  end
end
