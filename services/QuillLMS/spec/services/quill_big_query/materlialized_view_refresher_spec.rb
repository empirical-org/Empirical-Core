# frozen_string_literal: true

require 'rails_helper'

describe QuillBigQuery::MaterializedViewRefresher do

  describe 'run' do
    let(:report_sessions_sql) {'SELECT 2'}
    let(:query_key) { 'reporting_sessions_view' }
    let(:drop_sql) {'DROP MATERIALIZED VIEW IF EXISTS lms.recent_reporting_sessions'}
    let(:create_sql) { 'CREATE MATERIALIZED VIEW lms.recent_reporting_sessions AS (SELECT 2); SELECT 1;'}

    before do
      stub_const('QuillBigQuery::MaterializedViewRefresher::QUERY_FOLDER', Rails.root + 'spec/fixtures/sql/')
    end

    subject { described_class.run(query_key)}

    it 'should call run properly' do
      expect(QuillBigQuery::WritePermissionsRunner).to receive(:run).with(drop_sql)
      expect(QuillBigQuery::WritePermissionsRunner).to receive(:run).with(create_sql)

      subject
    end

    context 'unknown key' do
      let(:query_key) {'some-unknown-key'}

      it 'should raise with unknown key' do

        expect {subject}.to raise_error(QuillBigQuery::MaterializedViewRefresher::InvalidQueryKeyError)
      end
    end
  end
end
