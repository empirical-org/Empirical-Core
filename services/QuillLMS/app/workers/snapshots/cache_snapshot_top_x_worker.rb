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

      Rails.cache.write(cache_key, payload, expires_in: timeframe[:current_end] + 1.day)

      PusherTrigger.run(user_id, PUSHER_EVENT,
        {
          query: query,
          timeframe: timeframe[:name],
          school_ids: school_ids,
          grades: grades
        }
      )
    end

    private def generate_payload(query, timeframe, school_ids, grades)
      timeframe_start = timeframe[:current_start]
      timeframe_end = timeframe[:current_end]

      QUERIES[query].run(timeframe_start,
        timeframe_end,
        school_ids,
        grades)
    end
  end
end
