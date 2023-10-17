# frozen_string_literal: true

module Snapshots
  class CacheSnapshotPreviousCountWorker < CacheSnapshotCountWorker
    PUSHER_EVENT = 'admin-snapshot-previous-count-cached'
  end
end
