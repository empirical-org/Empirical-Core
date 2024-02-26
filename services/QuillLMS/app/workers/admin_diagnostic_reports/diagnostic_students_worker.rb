# frozen_string_literal: true

module AdminDiagnosticReports
  class DiagnosticStudentsWorker
    include Sidekiq::Worker

    PUSHER_EVENT = 'admin-diagnostic-students-cached'
    TOO_SLOW_THRESHOLD = 20

    class SlowQueryError < StandardError
      def message
        "Diagnostic Student query took more than #{TOO_SLOW_THRESHOLD}"
      end
    end

    QUERIES = {
      'diagnostic-students' => DiagnosticPerformanceByStudentViewQuery,
      'student-recommendatiosn' => DiagnosticRecommendationsByStudentQuery
    }

    def perform(cache_key, query, diagnostic_id, user_id, timeframe, school_ids, filters)
      payload = generate_payload(query, diagnostic_id, timeframe, school_ids, filters)

      Rails.cache.write(cache_key, payload, expires_in: cache_expiry)

      filter_hash = PayloadHasher.run([
        query,
        diagnostic_id,
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

    private def generate_payload(query, diagnostic_id, timeframe, school_ids, filters)
      timeframe_start = parse_datetime_string(timeframe['timeframe_start'])
      timeframe_end = parse_datetime_string(timeframe['timeframe_end'])
      filters_symbolized = filters.symbolize_keys

      long_process_notifier = LongProcessNotifier.new(
        SlowQueryError.new,
        TOO_SLOW_THRESHOLD,
        {
          query:,
          diagnostic_id:,
          timeframe_start:,
          timeframe_end:,
          school_ids:
        }.merge(filters_symbolized)
      )

      long_process_notifier.run do
        QUERIES[query].run(**{
          diagnostic_id:,
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
