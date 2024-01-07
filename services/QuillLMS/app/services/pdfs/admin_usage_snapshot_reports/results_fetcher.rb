# frozen_string_literal: true

module Pdfs
  module AdminUsageSnapshotReports
    class ResultsFetcher < ApplicationService
      CACHE_REPORT_NAME = SnapshotsController::CACHE_REPORT_NAME

      attr_reader :admin_report_filter_selection, :previous_timeframe, :query_key, :worker

      delegate :classroom_ids,
        :custom_end,
        :custom_start,
        :grades,
        :school_ids,
        :teacher_ids,
        :timeframe,
        :timeframe_value,
        :user_id,
        to: :admin_report_filter_selection

      def initialize(admin_report_filter_selection:, query_key:, worker:, previous_timeframe: false)
        @admin_report_filter_selection = admin_report_filter_selection
        @previous_timeframe = previous_timeframe
        @query_key = query_key
        @worker = worker
      end

      def run
        return nil unless user_id && timeframe_start && timeframe_end

        cached_results || (run_query && cached_results)
      end

      private def cache_key
        @cache_key ||=
          Snapshots::CacheKeys.generate_key(
            CACHE_REPORT_NAME,
            query_key,
            timeframe_value,
            timeframe_start,
            timeframe_end,
            school_ids,
            additional_filters: { grades:, teacher_ids:, classroom_ids: }
          )
      end

      private def cached_results = Rails.cache.read(cache_key)
      private def run_query = worker.new.perform(*worker_args)
      private def timeframe_end = timeframes[1].to_s
      private def timeframe_start = timeframes[0].to_s

      private def timeframes
        @timeframes ||=
          Snapshots::Timeframes.calculate_timeframes(timeframe_value, custom_start:, custom_end:, previous_timeframe:)
      end

      private def worker_args
        [
          cache_key,
          query_key,
          user_id,
          { name: timeframe_value, timeframe_end:, timeframe_start: }.stringify_keys,
          school_ids,
          { grades:, teacher_ids:, classroom_ids: }.stringify_keys,
          nil
        ]
      end
    end
  end
end
