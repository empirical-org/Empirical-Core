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
      previous_timeframe_start = timeframe[:previous_start]
      current_timeframe_start = timeframe[:current_start]
      timeframe_end = timeframe[:current_end]

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

      { current: current_snapshot&.fetch('count', nil), previous: previous_snapshot&.fetch('count', nil) }
    end
  end
end
