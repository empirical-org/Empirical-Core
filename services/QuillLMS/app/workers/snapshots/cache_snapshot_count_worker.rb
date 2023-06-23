# frozen_string_literal: true

module Snapshots
  class CacheSnapshotCountWorker
    include Sidekiq::Worker

    PUSHER_EVENT = 'admin-snapshot-count-cached'

    QUERIES = {
      'active-classrooms' => Snapshots::ActiveClassroomsQuery,
      'active-students' => Snapshots::ActiveStudentsQuery,
      'active-teachers' => Snapshots::ActiveTeachersQuery,
      'activities-assigned' => Snapshots::ActivitiesAssignedQuery,
      'activities-completed' => Snapshots::ActivitiesCompletedQuery,
      'average-activities-completed-per-student' => Snapshots::AverageActivitiesCompletedPerStudentQuery,
      'sentences-written' => Snapshots::SentencesWrittenQuery,
      'student-learning-hours' => Snapshots::StudentLearningHoursQuery
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
      previous_timeframe_start = timeframe['previous_start']
      current_timeframe_start = timeframe['current_start']
      timeframe_end = timeframe['current_end']

      current_snapshot = QUERIES[query].run(current_timeframe_start,
        timeframe_end,
        school_ids,
        grades)

      if previous_timeframe_start
        previous_snapshot = QUERIES[query].run(previous_timeframe_start,
          current_timeframe_start,
          school_ids,
          grades)
      else
        previous_snapshot = nil
      end

      { current: current_snapshot&.fetch(:count, nil), previous: previous_snapshot&.fetch(:count, nil) }
    end
  end
end
