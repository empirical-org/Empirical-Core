# frozen_string_literal: true

module AdminDiagnosticReports
  class DiagnosticOverviewWorker
    include Sidekiq::Worker

    PUSHER_EVENT = 'admin-diagnostic-ovewview-cached'

    QUERIES = {
      'pre-diagnostic-assigned' => PreDiagnosticAssignedQuery,
      'pre-diagnostic-completed' => PreDiagnosticCompletedQuery,
      'recommendations' => DiagnosticRecommendationsQuery,
      'post-diagnostic-assigned' => PostDiagnosticAssignedQuery,
      'post-diagnostic-completed' => PostDiagnosticCompletedQuery
    }

    def perform(cache_key, query, user_id, timeframe, school_ids, filters)
      payload = generate_payload(query, timeframe, school_ids, filters)

      Rails.cache.write(cache_key, payload, expires_in: cache_expiry)

      PusherTrigger.run(user_id, PUSHER_EVENT,
        {
          query: query,
          timeframe: timeframe['name'],
          school_ids: school_ids
        }.merge(filters)
      )
    end

    private def cache_expiry
      # We need to pass a number of seconds to Redis as a TTL value, and we
      # want to expire our caches overnight so that each day reports can be
      # updated, so we want the number of seconds until end of day
      now = DateTime.current
      now.end_of_day.to_i - now.to_i
    end

    private def generate_payload(query, timeframe, school_ids, filters)
      previous_timeframe_start = parse_datetime_string(timeframe['previous_start'])
      previous_timeframe_end = parse_datetime_string(timeframe['previous_end'])
      current_timeframe_start = parse_datetime_string(timeframe['current_start'])
      timeframe_end = parse_datetime_string(timeframe['current_end'])
      filters_symbolized = filters.symbolize_keys

      current_snapshot = QUERIES[query].run(**{
        timeframe_start: current_timeframe_start,
        timeframe_end: timeframe_end,
        school_ids: school_ids
      }.merge(filters_symbolized))

      if previous_timeframe_start
        previous_snapshot = QUERIES[query].run(**{
          timeframe_start: previous_timeframe_start,
          timeframe_end: previous_timeframe_end,
          school_ids: school_ids
        }.merge(filters_symbolized))
      else
        previous_snapshot = nil
      end

      post_process_query(current_snapshot)
    end

    private def parse_datetime_string(value)
      return nil if value.nil?

      DateTime.parse(value)
    end
  end
end
