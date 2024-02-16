# frozen_string_literal: true

require 'rails_helper'

describe QuillBigQuery::MaterializedViewRefresher do
  let(:query_key) { 'reporting_sessions_view' }

  describe 'config' do
    subject {described_class.new(query_key)}

    it 'should find SQL file' do
      expect { subject.send(:create_sql)}.not_to raise_error
    end
  end

  describe 'run' do
    let(:report_sessions_sql_from_fixture) {'SELECT 2'}
    let(:drop_sql) {'DROP MATERIALIZED VIEW IF EXISTS lms.recent_reporting_sessions'}
    let(:create_sql) do
      "CREATE MATERIALIZED VIEW lms.recent_reporting_sessions AS (#{report_sessions_sql_from_fixture}); SELECT 1;"
    end

    before do
      stub_const('QuillBigQuery::MaterializedViewRefresher::QUERY_FOLDER', Rails.root.join('spec/fixtures/sql/'))
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
