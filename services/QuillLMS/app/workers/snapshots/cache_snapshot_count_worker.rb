# frozen_string_literal: true

module Snapshots
  class CacheSnapshotCountWorker
    include Sidekiq::Worker

    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    CURRENT_TIMEFRAME_PUSHER_EVENT = 'admin-snapshot-count-cached'
    PREVIOUS_TIMEFRAME_PUSHER_EVENT = 'admin-snapshot-previous-count-cached'
    TOO_SLOW_THRESHOLD = 20

    class SlowQueryError < StandardError
      def message
        "Snapshot Count query took more than #{TOO_SLOW_THRESHOLD}"
      end
    end

    QUERIES = ::Snapshots::COUNT_QUERY_MAPPING

    def perform(cache_key, query, user_id, timeframe, school_ids, filters, previous_timeframe)
      payload = generate_payload(query, timeframe, school_ids, filters)

      Rails.cache.write(cache_key, payload, expires_in: cache_expiry)

      filter_hash = PayloadHasher.run([
        query,
        timeframe['name'],
        timeframe['custom_start'],
        timeframe['custom_end'],
        school_ids,
        filters['grades'],
        filters['teacher_ids'],
        filters['classroom_ids']
      ].flatten)

      SendPusherMessageWorker.perform_async(user_id, pusher_event_name(query, previous_timeframe: previous_timeframe), filter_hash)
    end

    private def pusher_event_name(query, previous_timeframe: false)
      pusher_event = previous_timeframe ? PREVIOUS_TIMEFRAME_PUSHER_EVENT : CURRENT_TIMEFRAME_PUSHER_EVENT
      "#{pusher_event}:#{query}"
    end

    private def cache_expiry
      # We need to pass a number of seconds to Redis as a TTL value, and we
      # want to expire our caches overnight so that each day reports can be
      # updated, so we want the number of seconds until end of day
      now = DateTime.current
      now.end_of_day.to_i - now.to_i
    end

    private def generate_payload(query, timeframe, school_ids, filters)
      timeframe_start = parse_datetime_string(timeframe['timeframe_start'])
      timeframe_end = parse_datetime_string(timeframe['timeframe_end'])
      filters_symbolized = filters.symbolize_keys

      long_process_notifier = LongProcessNotifier.new(
        SlowQueryError.new,
        TOO_SLOW_THRESHOLD,
        {
          query:,
          timeframe_start:,
          timeframe_end:,
          school_ids:
        }.merge(filters_symbolized)
      )

      long_process_notifier.run do
        current_snapshot = QUERIES[query].run(**{
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
