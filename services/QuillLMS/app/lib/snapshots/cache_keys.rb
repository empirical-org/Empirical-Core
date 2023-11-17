# frozen_string_literal: true

module Snapshots
  class CacheKeys
    def self.generate_key(report, query, timeframe_name, current_start, current_end, school_ids, additional_filters: {})
      root_key(report, query, timeframe_name, current_start, current_end, school_ids)
        .append(grades_segment(additional_filters[:grades]))
        .append(teacher_ids_segment(additional_filters[:teacher_ids]))
        .append(classroom_ids_segment(additional_filters[:classroom_ids]))
        .compact
    end

    def self.root_key(report, query, timeframe_name, current_start, current_end, school_ids)
      [
        report,
        query,
        timeframe_name,
        current_start,
        current_end,
        "school-ids-#{(school_ids || []).sort.join('-')}"
      ]
    end

    def self.array_segment(name, values)
      return if values.blank?

      "#{name}-#{values.map(&:to_s).sort.join('-')}"
    end

    def self.grades_segment(grades)
      array_segment('grades', grades)
    end

    def self.teacher_ids_segment(teacher_ids)
      array_segment('teacher-ids', teacher_ids)
    end

    def self.classroom_ids_segment(classroom_ids)
      array_segment('classroom-ids', classroom_ids)
    end
  end
end
