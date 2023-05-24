# frozen_string_literal: true

module Snapshots
  class CacheKeys
    def self.generate_key(query, current_timeframe_start, timeframe_end, school_ids, grades)
      [
        "admin-snapshot",
        query,
        current_timeframe_start,
        timeframe_end,
        "school-ids-#{(school_ids || []).sort.join('-')}",
        "grades-#{(grades || []).map(&:to_s).sort.join('-')}"
      ]
    end
  end
end
