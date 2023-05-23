# frozen_string_literal: true

module Snapshots
  class CacheKeys
    def self.generate_key(query, user_id, timeframe_name, school_ids, grades)
      [
        "admin-snapshot",
        query,
        timeframe_name,
        "school-ids-#{school_ids.sort.join('-')}",
        "grades-#{grades.map(&:to_s).sort.join('-')}",
        user_id
      ]
    end
  end
end
