# frozen_string_literal: true

module Snapshots
  class CacheSnapshotCountWorker
    include Sidekiq::Worker

    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    PUSHER_EVENT = 'admin-snapshot-count-cached'

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

      hash_target = [
        query,
        timeframe['name'],
        school_ids.join('-'),
        filters[:grades]&.join('-'),
        filters[:teacher_ids]&.join('-'),
        filters[:classroom_ids]&.join('-')
      ].join('-')
      filter_hash = Digest::MD5.hexdigest(hash_target)
      PusherTrigger.run(user_id, PUSHER_EVENT, {
        target: hash_target,
        hash: filter_hash
      })
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

      { current: current_snapshot&.fetch(:count, nil), previous: previous_snapshot&.fetch(:count, nil) }
    end

    private def parse_datetime_string(value)
      return nil if value.nil?

      DateTime.parse(value)
    end
  end
end
