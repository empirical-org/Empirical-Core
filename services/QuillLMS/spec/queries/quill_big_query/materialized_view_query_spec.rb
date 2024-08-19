# frozen_string_literal: true

require 'rails_helper'

describe QuillBigQuery::MaterializedViewQuery do
  let(:view_key) { 'reporting_sessions_view' }
  let(:name_with_dataset) { 'lms.recent_reporting_sessions_view' }
  let(:name_fallback) { 'recent_reporting_sessions_local' }
  let(:query_fallback) { 'WITH recent_reporting_sessions_local AS (SELECT 2) SELECT 1 FROM recent_reporting_sessions_local' }
  let(:query) { 'SELECT 1 FROM lms.recent_reporting_sessions_view' }
  let(:result) { 'result' }
  let(:runner) { double(:execute) }
  let(:klass) do
    Class.new(QuillBigQuery::MaterializedViewQuery) do
      def materialized_views = [view]
      def view = materialized_view('reporting_sessions_view')
      def query = 'SELECT 1 FROM lms.recent_reporting_sessions_view'
    end
  end

  before do
    stub_const('QuillBigQuery::MaterializedView::QUERY_FOLDER', Rails.root.join('spec/fixtures/sql/'))
  end

  subject { klass.new(runner: runner) }

  it 'should generate query fallback' do
    expect(subject.query_fallback).to eq query_fallback
  end

  describe 'run_query' do
    subject { klass.new(runner: runner).run_query }

    it 'mat view query success' do
      expect(runner).to receive(:execute).with(query).and_return(result)
      expect(runner).to_not receive(:execute).with(query_fallback)

      expect(subject).to eq(result)
    end

    context 'mat view query error' do
      let(:message) { 'This is the error message.' }

      before do
        allow(runner).to receive(:execute).with(query).and_raise(::Google::Cloud::InvalidArgumentError, message)
        allow(runner).to receive(:execute).with(query_fallback).and_return(result)
      end

      it { expect(subject).to eq(result) }

      it do
        expect(ErrorNotifier).to receive(:report).with(described_class::BrokenMaterializedViewError.new(message))
        subject
      end
    end
  end
end
