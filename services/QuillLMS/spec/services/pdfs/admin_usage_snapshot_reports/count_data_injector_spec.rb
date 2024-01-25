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

      context 'with invalid query key' do
        let(:valid_query_key) { false }
        let(:current_count) { 10 }
        let(:previous_count) { 10 }

        it { is_expected.to eq item }
      end

      context 'with valid query key' do
        let(:valid_query_key) { true }
        let(:count) { current_count }
        let(:injected_item) { item.merge(count:, change:) }

        context 'when current_count is nil' do
          let(:current_count) { nil }
          let(:previous_count) { 100 }
          let(:change) { nil }

          it { is_expected.to eq injected_item }
        end

        context 'when previous_count is 0' do
          let(:current_count) { 10 }
          let(:previous_count) { 0 }
          let(:change) { 1000 }

          it { is_expected.to eq injected_item }
        end

        context 'when previous_count is nil' do
          let(:current_count) { 5 }
          let(:previous_count) { nil }
          let(:change) { 500 }

          it { is_expected.to eq injected_item }
        end

        context 'both counts are non-zero' do
          let(:current_count) { 120 }
          let(:previous_count) { 100 }
          let(:change) { 20 }

          it { is_expected.to eq injected_item }
        end
      end

    end
  end
end
