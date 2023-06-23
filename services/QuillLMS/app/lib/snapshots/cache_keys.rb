# frozen_string_literal: true

module Snapshots
  class CacheKeys
    def self.generate_key(query, previous_start, current_start, current_end, school_ids, grades, teacher_ids, classroom_ids)
      [
        "admin-snapshot",
        query,
        previous_start,
        current_start,
        current_end,
        "school-ids-#{(school_ids || []).sort.join('-')}",
        "grades-#{(grades || []).map(&:to_s).sort.join('-')}",
        "teacher-ids-#{(teacher_ids || []).sort.join('-')}",
        "classrom-ids-#{(classroom_ids || []).sort.join('-')}",
      ]
    end
  end
end
