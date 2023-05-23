# frozen_string_literal: true

module Snapshots
  class CacheKeys
    CUSTOM_TIMEFRAME_NAME = 'custom'

    def self.generate_key(query, user_id, timeframe_hash, school_ids, grades)
      timeframe_part = timeframe_hash[:name]

      if timeframe_part == CUSTOM_TIMEFRAME_NAME
        timeframe_part += "-#{timeframe_hash[:custom_start]}-#{timeframe_hash[:custom_end]}"
      end

      [
        "admin-snapshot",
        query,
        timeframe_part,
        "school-ids-#{school_ids.sort.join('-')}",
        "grades-#{grades.map(&:to_s).sort.join('-')}",
        user_id
      ]
    end
  end
end
