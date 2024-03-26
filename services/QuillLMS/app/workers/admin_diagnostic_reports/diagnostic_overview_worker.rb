# frozen_string_literal: true

module AdminDiagnosticReports
  class DiagnosticOverviewWorker
    include Sidekiq::Worker

    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    PUSHER_EVENT = 'admin-diagnostic-overview-cached'
    TOO_SLOW_THRESHOLD = 20

    class SlowQueryError < StandardError
      def message
        "Diagnostic Overview query took more than #{TOO_SLOW_THRESHOLD}"
      end
    end

    QUERIES = {
      'pre-diagnostic-assigned' => PreDiagnosticAssignedViewQuery,
      'pre-diagnostic-completed' => PreDiagnosticCompletedViewQuery,
      'recommendations' => DiagnosticRecommendationsQuery,
      'post-diagnostic-assigned' => PostDiagnosticAssignedViewQuery,
      'post-diagnostic-completed' => PostDiagnosticCompletedViewQuery
    }

    def perform(cache_key, query, aggregation, user_id, timeframe, school_ids, filters)
      payload = generate_payload(query, aggregation, timeframe, school_ids, filters)

      Rails.cache.write(cache_key, payload, expires_in: cache_expiry)

      filter_hash = PayloadHasher.run([
        query,
        timeframe['name'],
        school_ids,
        filters['grades'],
        filters['teacher_ids'],
        filters['classroom_ids']
      ].flatten)
      SendPusherMessageWorker.perform_async(user_id, PUSHER_EVENT, filter_hash)
    end

    private def cache_expiry
      # We need to pass a number of seconds to Redis as a TTL value, and we
      # want to expire our caches overnight so that each day reports can be
      # updated, so we want the number of seconds until end of day
      now = DateTime.current
      now.end_of_day.to_i - now.to_i
    end

    private def generate_payload(query, aggregation, timeframe, school_ids, filters)
      timeframe_start = parse_datetime_string(timeframe['timeframe_start'])
      timeframe_end = parse_datetime_string(timeframe['timeframe_end'])
      filters_symbolized = filters.symbolize_keys

      long_process_notifier = LongProcessNotifier.new(
        SlowQueryError.new,
        TOO_SLOW_THRESHOLD,
        {
          query:,
          aggregation:,
          timeframe_start:,
          timeframe_end:,
          school_ids:
        }.merge(filters_symbolized)
      )

      long_process_notifier.run do
        QUERIES[query].run(**{
          aggregation:,
          timeframe_start:,
          timeframe_end:,
          school_ids:
        }.merge(filters_symbolized))
      end
    end

    private def parse_datetime_string(value)
      return nil if value.nil?

      DateTime.parse(value)
    end
  end
end
