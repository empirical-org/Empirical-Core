# frozen_string_literal: true

module Snapshots
  class CacheSnapshotCountWorker
    include Sidekiq::Worker

    DEFAULT_CACHE_EXPIRATION = 24.hours
    PUSHER_EVENT = 'admin-snapshot-count-cached'

    QUERIES = {
      'active-classrooms' => Snapshots::ActiveClassroomsQuery,
      'active-students' => Snapshots::ActiveStudentsQuery,
      'activities-assigned' => Snapshots::ActivitiesAssignedQuery,
      'activities-completed' => Snapshots::ActivitiesCompletedQuery,
      'average-activities-completed-per-student' => Snapshots::AverageActivitiesCompletedPerStudentQuery,
      'sentences-written' => Snapshots::SentencesWrittenQuery,
      'student-learning-hours' => Snapshots::StudentLearningHoursQuery
    }

    def perform(query, user_id, timeframe, school_ids, grades)
      timeframe_name = timeframe[:name]
      previous_timeframe_start = timeframe[:previous_start]
      current_timeframe_start = timeframe[:current_start]
      timeframe_end = timeframe[:current_end]

      current_snapshot = QUERIES[query].run(user_id,
        current_timeframe_start,
        timeframe_end,
        school_ids,
        grades)

      previous_snapshot = QUERIES[query].run(user_id,
        previous_timeframe_start,
        current_timeframe_start,
        school_ids,
        grades)

      payload = { current: current_snapshot, previous: previous_snapshot }

      cache_key = Snapshots::CacheKeys.generate_key(query,
        user_id,
        {
          name: timeframe_name,
          custom_start: timeframe_name == Snapshots::CacheKeys::CUSTOM_TIMEFRAME_NAME ? current_timeframe_start : nil,
          custom_end: timeframe_name == Snapshots::CacheKeys::CUSTOM_TIMEFRAME_NAME ? current_timeframe_end : nil
        },
        school_ids,
        grades)

      Rails.cache.write(cache_key, payload, expires_in: DEFAULT_CACHE_EXPIRATION)

      PusherTrigger.run(user_id, PUSHER_EVENT,
        {
          query: query,
          timeframe: timeframe_name,
          school_ids: school_ids,
          grades: grades
        }
      )
    end
  end
end
