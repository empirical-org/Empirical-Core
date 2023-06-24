# frozen_string_literal: true

module Snapshots
  class CacheKeys
    def self.generate_key(query, previous_start, current_start, current_end, school_ids, additional_filters: {})
      root_key(query, previous_start, current_start, current_end, school_ids)
        .append(grades_segment(additional_filters.dig(:grades)))
        .append(teacher_ids_segment(additional_filters.dig(:teacher_ids)))
        .append(classroom_ids_segment(additional_filters.dig(:classroom_ids)))
        .compact
    end

    def self.root_key(query, previous_start, current_start, current_end, school_ids)
      [
        "admin-snapshot",
        query,
        previous_start,
        current_start,
        current_end,
        "school-ids-#{(school_ids || []).sort.join('-')}"
      ]
    end

    def self.grades_segment(grades)
      return if grades.nil? || grades.empty?

      "grades-#{(grades || []).map(&:to_s).sort.join('-')}"
    end

    def self.teacher_ids_segment(teacher_ids)
      return if teacher_ids.nil? || teacher_ids.empty? 

      "teacher-ids-#{(teacher_ids || []).sort.join('-')}"
    end

    def self.classroom_ids_segment(classroom_ids)
      return if classroom_ids.nil? || classroom_ids.empty?

      "classroom-ids-#{(classroom_ids || []).sort.join('-')}"
    end
  end
end
