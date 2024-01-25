# frozen_string_literal: true

require 'rails_helper'

module Pdfs
  module AdminUsageSnapshotReports
    RSpec.describe RankingDataInjector do
      subject { described_class.run(admin_report_filter_selection:, item:) }

      let(:admin_report_filter_selection) { create(:admin_report_filter_selection, :with_default_filters) }
      let(:queryKey) { 'query-key' }
      let(:item) { { queryKey: } }

      before { allow(Snapshots::TOPX_QUERY_MAPPING).to receive(:key?).with(queryKey).and_return(valid_query_key) }

      context 'with invalid query key' do
        let(:valid_query_key) { false }

        it { is_expected.to eq item }
      end

      context 'with valid query key' do
        let(:valid_query_key) { true }
        let(:data) { [{ value: nil, count: nil }] }
        let(:worker) { Snapshots::CacheSnapshotTopXWorker }

        before do
          allow(ResultsFetcher)
            .to receive(:run)
            .with(admin_report_filter_selection:, query_key: queryKey, worker:)
            .and_return(data)
        end

        it { is_expected.to eq item.merge(data:) }
      end
    end
  end
end
