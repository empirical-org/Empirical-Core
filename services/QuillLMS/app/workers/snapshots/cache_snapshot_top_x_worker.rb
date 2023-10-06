# frozen_string_literal: true

module Snapshots
  class CacheSnapshotTopXWorker
    include Sidekiq::Worker

    class SnapshotTopXTooSlow < StandardError; end

    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    PUSHER_EVENT = 'admin-snapshot-top-x-cached'
    TOO_SLOW_THRESHOLD = 20

    QUERIES = {
      'top-concepts-assigned' => Snapshots::TopConceptsAssignedQuery,
      'top-concepts-practiced' => Snapshots::TopConceptsPracticedQuery,
      'most-active-grades' => Snapshots::MostActiveGradesQuery,
      'most-active-schools' => Snapshots::MostActiveSchoolsQuery,
      'most-active-teachers' => Snapshots::MostActiveTeachersQuery,
      'most-assigned-activities' => Snapshots::MostAssignedActivitiesQuery,
      'most-completed-activities' => Snapshots::MostCompletedActivitiesQuery
    }

    def perform(cache_key, query, user_id, timeframe, school_ids, filters)
      payload = generate_payload(query, timeframe, school_ids, filters)

      Rails.cache.write(cache_key, payload.to_a, expires_in: cache_expiry)

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
      timeframe_start = DateTime.parse(timeframe['current_start'])
      timeframe_end = DateTime.parse(timeframe['current_end'])
      filters_symbolized = filters.symbolize_keys

      ErrorNotifier.report_long_running(SnapshotTopXTooSlow.new("Snapshot TopX query took more than #{TOO_SLOW_THRESHOLD}"), TOO_SLOW_THRESHOLD, {
        query: query,
        timeframe_start: timeframe_start,
        timeframe_end: timeframe_end,
        school_ids: school_ids
      }.merge(filters_symbolized)) do
        QUERIES[query].run(**{
          timeframe_start: timeframe_start,
          timeframe_end: timeframe_end,
          school_ids: school_ids
        }.merge(filters_symbolized))
      end
    end
  end
end
