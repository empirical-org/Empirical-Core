# frozen_string_literal: true

class CacheAdminSnapshotsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(admin_id)
    @user = User.find_by_id(admin_id)
    return unless @user

    @school_ids = @user.schools_admins.pluck(:school_id)

    current_start, current_end = Snapshots::Timeframes.calculate_timeframes(Snapshots::Timeframes::DEFAULT_TIMEFRAME)
    previous_start, previous_end = Snapshots::Timeframes.calculate_timeframes(Snapshots::Timeframes::DEFAULT_TIMEFRAME, previous_timeframe: true)

    Snapshots::CacheSnapshotCountWorker::QUERIES.keys.each do |query|
      Snapshots::CacheSnapshotCountWorker.perform_async(*generate_worker_payload(query, previous_start, previous_end))
      Snapshots::CacheSnapshotCountWorker.perform_async(*generate_worker_payload(query, current_start, current_end))
    end

    Snapshots::CacheSnapshotTopXWorker::QUERIES.keys.each do |query|
      Snapshots::CacheSnapshotTopXWorker.perform_async(*generate_worker_payload(query, current_start, current_end))
    end
  end

  private def generate_worker_payload(query, timeframe_start, timeframe_end)
    cache_key = Snapshots::CacheKeys.generate_key(query,
      Snapshots::Timeframes::DEFAULT_TIMEFRAME,
      timeframe_start,
      timeframe_end,
      @school_ids
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
      @school_ids,
      {},
      nil
    ]
  end
end
