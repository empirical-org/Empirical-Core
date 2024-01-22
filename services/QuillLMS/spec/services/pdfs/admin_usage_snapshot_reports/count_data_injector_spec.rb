# frozen_string_literal: true

require 'rails_helper'

module Pdfs
  module AdminUsageSnapshotReports
    RSpec.describe CountDataInjector do
      subject { described_class.run(admin_report_filter_selection:, item:) }

      let(:item) { { queryKey:, type: } }
      let(:type) { 'count' }
      let(:queryKey) { 'query-key' }
      let(:admin_report_filter_selection) { create(:admin_report_filter_selection, :with_default_filters) }
      let(:worker) { Snapshots::CacheSnapshotCountWorker }
      let(:results_fetcher) { Pdfs::AdminUsageSnapshotReports::ResultsFetcher }
      let(:current_results) { { count: current_count } }
      let(:previous_results) { { count: previous_count } }

      before do
        allow(results_fetcher)
          .to receive(:run)
          .with(admin_report_filter_selection:, query_key: queryKey, worker:)
          .and_return(current_results)

        allow(results_fetcher)
          .to receive(:run)
          .with(admin_report_filter_selection:, query_key: queryKey, worker:, previous_timeframe: true)
          .and_return(previous_results)

        allow(Snapshots::COUNT_QUERY_MAPPING)
          .to receive(:key?)
          .with(queryKey)
          .and_return(valid_query_key)
      end

      context 'with valid query key' do
        let(:valid_query_key) { true }
        let(:current_count) { 10 }
        let(:previous_count) { 5 }
        let(:change) { 50 }
        let(:change_calculator) { Pdfs::AdminUsageSnapshotReports::CountDataInjector::CountDataChangeCalculator }
        let(:count) { current_count }

        before { allow(change_calculator).to receive(:run).and_return(change) }

        it { expect(subject).to eq(item.merge(count:, change:)) }
      end

      context 'with invalid query key' do
        let(:valid_query_key) { false }
        let(:current_count) { 10 }
        let(:previous_count) { 10 }

        it { is_expected.to eq(item) }
      end
    end

    RSpec.describe CountDataInjector::CountDataChangeCalculator do
      subject { described_class.run(current_count:, previous_count:) }

      context 'when current_count is nil' do
        let(:current_count) { nil }
        let(:previous_count) { 100 }

        it { is_expected.to be_nil }
      end

      context 'when previous_count is 0' do
        let(:current_count) { 10 }
        let(:previous_count) { 0 }

        it { is_expected.to eq 1000 }
      end

      context 'when previous_count is nil' do
        let(:current_count) { 5 }
        let(:previous_count) { nil }

        it { is_expected.to eq 500 }
      end

      context 'normal case' do
        let(:current_count) { 120 }
        let(:previous_count) { 100 }

        it { is_expected.to eq 20 }
      end
    end
  end
end
