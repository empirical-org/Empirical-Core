# frozen_string_literal: true

require 'rails_helper'

describe QuillBigQuery::MaterializedView do
  let(:view_key) { 'reporting_sessions_view' }

  subject {described_class.new(view_key)}

  describe 'production config without stubs' do
    it {expect { subject.sql }.not_to raise_error }

    it {expect(subject.name).to eq('recent_reporting_sessions_view')}
    it {expect(subject.name_with_dataset).to eq('lms.recent_reporting_sessions_view')}
    it {expect(subject.name_fallback).to eq('recent_reporting_sessions_local')}
  end

  describe 'text sql' do
    let(:report_sessions_sql_from_fixture) {'SELECT 2'}
    let(:drop_sql) {'DROP MATERIALIZED VIEW IF EXISTS lms.recent_reporting_sessions_view'}
    let(:create_sql) do
      "CREATE MATERIALIZED VIEW lms.recent_reporting_sessions_view AS (#{report_sessions_sql_from_fixture}); SELECT COUNT(*) FROM lms.recent_reporting_sessions_view;"
    end
    let(:fallback_with) {"recent_reporting_sessions_local AS (#{report_sessions_sql_from_fixture})"}

    before do
      stub_const('QuillBigQuery::MaterializedView::QUERY_FOLDER', Rails.root.join('spec/fixtures/sql/'))
    end

    it {expect(subject.fallback_with_clause).to eq fallback_with}

    describe 'refresh!' do
      it 'should call refresh! properly' do
        expect(QuillBigQuery::WritePermissionsRunner).to receive(:run).with(drop_sql)
        expect(QuillBigQuery::WritePermissionsRunner).to receive(:run).with(create_sql)

        subject.refresh!
      end

      context 'unknown key' do
        let(:view_key) {'some-unknown-key'}

        it { expect {subject}.to raise_error(QuillBigQuery::MaterializedView::InvalidQueryKeyError)}
      end
    end

    describe 'drop!' do
      it 'should call drop! properly' do
        expect(QuillBigQuery::WritePermissionsRunner).to receive(:run).with(drop_sql)
        expect(QuillBigQuery::WritePermissionsRunner).to_not receive(:run).with(create_sql)

        subject.drop!
      end
    end

    describe 'create!' do
      it 'should call drop! properly' do
        expect(QuillBigQuery::WritePermissionsRunner).to_not receive(:run).with(drop_sql)
        expect(QuillBigQuery::WritePermissionsRunner).to receive(:run).with(create_sql)

        subject.create!
      end
    end
  end
end
