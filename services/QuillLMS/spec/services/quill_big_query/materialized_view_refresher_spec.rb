# frozen_string_literal: true

require 'rails_helper'

describe QuillBigQuery::MaterializedViewRefresher do
  let(:query_key) { 'reporting_sessions_view' }

  describe 'run' do
    let(:view_name) { 'lms.recent_reporting_sessions_view' }
    let(:view_sql) {'SELECT 2'}
    let(:drop_sql) {'DROP MATERIALIZED VIEW IF EXISTS lms.recent_reporting_sessions_view'}
    let(:create_sql) do
      "CREATE MATERIALIZED VIEW #{view_name} AS (#{view_sql}); SELECT COUNT(*) FROM #{view_name};"
    end
    let(:view_definition) { QuillBigQuery::MaterializedView.new(name: view_name, sql: view_sql, create_options: nil) }

    before do
      allow(QuillBigQuery::MaterializedView).to receive(:fetch).with(query_key).and_return(view_definition)
    end

    subject { described_class.run(query_key)}

    it 'should call run properly' do
      expect(QuillBigQuery::WritePermissionsRunner).to receive(:run).with(drop_sql)
      expect(QuillBigQuery::WritePermissionsRunner).to receive(:run).with(create_sql)

      subject
    end
  end
end
