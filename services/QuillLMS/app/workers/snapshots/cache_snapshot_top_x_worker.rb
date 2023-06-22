# frozen_string_literal: true

module Snapshots
  class CacheSnapshotTopXWorker
    include Sidekiq::Worker

    PUSHER_EVENT = 'admin-snapshot-top-x-cached'

    QUERIES = {
      'top-concepts-assigned' => Snapshots::TopConceptsAssignedQuery,
      'top-concepts-practiced' => Snapshots::TopConceptsPracticedQuery,
      'most-active-schools' => Snapshots::MostActiveSchoolsQuery,
    }

    def perform(cache_key, query, user_id, timeframe, school_ids, grades)
      payload = generate_payload(query, timeframe, school_ids, grades)

      Rails.cache.write(cache_key, payload, expires_in: cache_expiry)

      PusherTrigger.run(user_id, PUSHER_EVENT,
        {
          query: query,
          timeframe: timeframe['name'],
          school_ids: school_ids,
          grades: grades
        }
      )
    end

    private def cache_expiry
      # We need to pass a number of seconds to Redis as a TTL value, and we
      # want to expire our caches overnight so that each day reports can be
      # updated, so we want the number of seconds until end of day
      now = DateTime.current
      now.end_of_day.to_i - now.to_i
    end

    private def generate_payload(query, timeframe, school_ids, grades)
      QUERIES[query].run(timeframe['current_start'],
        timeframe['current_end'],
        school_ids,
        grades)
    end
  end
end