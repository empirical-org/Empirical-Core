# frozen_string_literal: true

module Pdfs
  module AdminUsageSnapshotReports
    class RankingDataInjector < ApplicationService
      WORKER = Snapshots::CacheSnapshotTopXWorker

      attr_reader :admin_report_filter_selection, :item

      def initialize(admin_report_filter_selection:, item:)
        @admin_report_filter_selection = admin_report_filter_selection
        @item = item
      end

      def run
        return item unless valid_query_key?

        item.merge(data:)
      end

      private def data = current_results
      private def current_results = ResultsFetcher.run(admin_report_filter_selection:, query_key:, worker: WORKER)
      private def query_key = item[:queryKey]
      private def valid_query_key? = Snapshots::TOPX_QUERY_MAPPING.key?(query_key)
    end
  end
end
