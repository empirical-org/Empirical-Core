# frozen_string_literal: true

require 'rails_helper'

describe QuillBigQuery::MaterializedView do
  let(:query_key) { 'reporting_sessions_view' }

  describe 'production config without stubs' do
    subject {described_class.new(query_key)}

    it 'should find SQL file' do
      expect { subject.sql }.not_to raise_error
    end
  end

  describe 'refresh!' do
    let(:report_sessions_sql_from_fixture) {'SELECT 2'}
    let(:drop_sql) {'DROP MATERIALIZED VIEW IF EXISTS lms.recent_reporting_sessions_view'}
    let(:create_sql) do
      "CREATE MATERIALIZED VIEW lms.recent_reporting_sessions_view AS (#{report_sessions_sql_from_fixture}); SELECT COUNT(*) FROM lms.recent_reporting_sessions_view;"
    end

    before do
      stub_const('QuillBigQuery::MaterializedView::QUERY_FOLDER', Rails.root.join('spec/fixtures/sql/'))
    end

    subject { described_class.new(query_key).refresh! }

    it 'should call refresh! properly' do
      expect(QuillBigQuery::WritePermissionsRunner).to receive(:run).with(drop_sql)
      expect(QuillBigQuery::WritePermissionsRunner).to receive(:run).with(create_sql)

      subject
    end

    context 'unknown key' do
      let(:query_key) {'some-unknown-key'}

      it 'should raise with unknown key' do

        expect {subject}.to raise_error(QuillBigQuery::MaterializedView::InvalidQueryKeyError)
      end
    end
  end
end
