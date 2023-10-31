# frozen_string_literal: true

class CacheAdminSnapshotsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  REPORT_NAME = 'usage_snapshot_report'

  def perform(admin_id)
    @user = User.find_by_id(admin_id)
    return unless @user

    current_start, current_end = Snapshots::Timeframes.calculate_timeframes(Snapshots::Timeframes::DEFAULT_TIMEFRAME)
    previous_start, previous_end = Snapshots::Timeframes.calculate_timeframes(Snapshots::Timeframes::DEFAULT_TIMEFRAME, previous_timeframe: true)

    Snapshots::CacheSnapshotCountWorker::QUERIES.keys.each do |query|
      Snapshots::CacheSnapshotCountWorker.perform_async(*generate_worker_payload(query, previous_start, previous_end, previous_timeframe: true))
      Snapshots::CacheSnapshotCountWorker.perform_async(*generate_worker_payload(query, current_start, current_end))
    end

    Snapshots::CacheSnapshotTopXWorker::QUERIES.keys.each do |query|
      Snapshots::CacheSnapshotTopXWorker.perform_async(*generate_worker_payload(query, current_start, current_end))
    end
  end

  private def generate_worker_payload(query, timeframe_start, timeframe_end, previous_timeframe: nil)
    stored_filters = AdminReportFilterSelection.find_by(user: @user, report: REPORT_NAME)&.filter_selections

    school_filters = stored_filters.fetch('schools', []).blank? ? @user.schools_admins.pluck(:school_id) : map_values(stored_filters.fetch('schools', []))

    non_school_filters = {
      grades: map_values(stored_filters.fetch('grades', [])),
      teacher_ids: map_values(stored_filters.fetch('teachers', [])),
      classroom_ids: map_values(stored_filters.fetch('classrooms', []))
    }

    cache_key = Snapshots::CacheKeys.generate_key(query,
      Snapshots::Timeframes::DEFAULT_TIMEFRAME,
      timeframe_start,
      timeframe_end,
      school_filters,
      additional_filters: non_school_filters
    )

    [
      cache_key,
      query,
      @user.id,
      {
        name: Snapshots::Timeframes::DEFAULT_TIMEFRAME,
        timeframe_start:,
        timeframe_end:
      },
      school_filters,
      non_school_filters,
      previous_timeframe
    ]
  end

  private def map_values(source_array)
    source_array.map { |h| h['value'] }
  end
end
