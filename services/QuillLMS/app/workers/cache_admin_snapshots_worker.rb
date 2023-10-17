# frozen_string_literal: true

class CacheAdminSnapshotsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(admin_id)
    @user = User.find_by_id(admin_id)
    return unless @user

    @school_ids = @user.schools_admins.pluck(:school_id)

    previous_start, previous_end, current_start, current_end = Snapshots::Timeframes.calculate_timeframes(Snapshots::DEFAULT_TIMEFRAME)

    Snapshots::CacheSnapshotCountWorker::QUERIES.each do |query, worker|
      worker.perform_async(generate_worker_payload(query, previous_start, previous_end))
      worker.perform_async(generate_worker_payload(query, current_start, current_end))
    end

    Snapshots::CacheSnapshotTopXWorker::QUERIES.each do |query, worker|
      worker.perform_async(generate_worker_payload(query, current_start, current_end)
    end
  end

  private def generate_worker_payload(query, timeframe_start, timeframe_end, school_ids)
    cache_key = Snapshots::CacheKeys.generate_key(query,
      Snapshots::DEFAULT_TIMEFRAME,
      timeframe_start,
      timeframe_end,
      school_ids 
    )

    [
      cache_key,
      query,
      @user.id,
      {
        name: Snapshots::DEFAULT_TIMEFRAME,
        timeframe_start:,
        timeframe_end:
      },
      @school_ids
    ]
  end
end
