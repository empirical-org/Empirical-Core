# frozen_string_literal: true

module Snapshots
  class CacheSnapshotCountWorker
    include Sidekiq::Worker

    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    PUSHER_EVENT = 'admin-snapshot-count-cached'
    TOO_SLOW_THRESHOLD = 20

    class SlowQueryError < StandardError
      def message
        "Snapshot Count query took more than #{TOO_SLOW_THRESHOLD}"
      end
    end

    QUERIES = {
      'active-classrooms' => Snapshots::ActiveClassroomsQuery,
      'active-students' => Snapshots::ActiveStudentsQuery,
      'active-teachers' => Snapshots::ActiveTeachersQuery,
      'activities-assigned' => Snapshots::ActivitiesAssignedQuery,
      'activities-completed' => Snapshots::ActivitiesCompletedQuery,
      'activity-packs-assigned' => Snapshots::ActivityPacksAssignedQuery,
      'activity-packs-completed' => Snapshots::ActivityPacksCompletedQuery,
      'average-active-classrooms-per-teacher' => Snapshots::AverageActiveClassroomsPerTeacherQuery,
      'average-activities-completed-per-student' => Snapshots::AverageActivitiesCompletedPerStudentQuery,
      'average-active-students-per-classroom' => Snapshots::AverageActiveStudentsPerClassroomQuery,
      'baseline-diagnostics-assigned' => Snapshots::BaselineDiagnosticsAssignedQuery,
      'baseline-diagnostics-completed' => Snapshots::BaselineDiagnosticsCompletedQuery,
      'classrooms-created' => Snapshots::ClassroomsCreatedQuery,
      'growth-diagnostics-assigned' => Snapshots::GrowthDiagnosticsAssignedQuery,
      'growth-diagnostics-completed' => Snapshots::GrowthDiagnosticsCompletedQuery,
      'sentences-written' => Snapshots::SentencesWrittenQuery,
      'student-accounts-created' => Snapshots::StudentAccountsCreatedQuery,
      'student-learning-hours' => Snapshots::StudentLearningHoursQuery,
      'teacher-accounts-created' => Snapshots::TeacherAccountsCreatedQuery
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

      long_process_notifier = LongProcessNotifier.new(
        SlowQueryError.new,
        TOO_SLOW_THRESHOLD,
        {
          query: query,
          timeframe_start: current_timeframe_start,
          timeframe_end: timeframe_end,
          school_ids: school_ids
        }.merge(filters_symbolized)
      )

      long_process_notifier.run do
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
        { current: current_snapshot&.fetch(:count, nil), previous: previous_snapshot&.fetch(:count, nil) }
      end
    end

    private def parse_datetime_string(value)
      return nil if value.nil?

      DateTime.parse(value)
    end
  end
end
