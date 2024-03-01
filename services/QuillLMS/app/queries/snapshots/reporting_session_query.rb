# frozen_string_literal: true

module Snapshots
  class ReportingSessionQuery < ::QuillBigQuery::MaterializedViewQuery
    attr_reader :timeframe_start, :timeframe_end, :school_ids, :grades, :teacher_ids, :classroom_ids, :user

    def initialize(timeframe_start:, timeframe_end:, school_ids:, grades: nil, teacher_ids: nil, classroom_ids: nil, user: nil, **options) # rubocop:disable Metrics/ParameterLists
      @timeframe_start = timeframe_start
      @timeframe_end = timeframe_end
      @school_ids = school_ids
      @grades = grades
      @teacher_ids = teacher_ids
      @classroom_ids = classroom_ids
      @user = user

      super(**options)
    end

    def materialized_views = [reporting_sessions_view]

    def reporting_sessions_view = materialized_view('reporting_sessions_view')

    def from_and_join_clauses
      "FROM #{reporting_sessions_view.name_with_dataset}"
    end

    def relevant_date_column
      "#{reporting_sessions_view.name}.completed_at"
    end

    def where_clause
      <<-SQL
        WHERE
          #{timeframe_where_clause}
          #{school_ids_where_clause}
          #{grades_where_clause}
          #{teacher_ids_where_clause}
          #{classroom_ids_where_clause}
      SQL
    end

    def timeframe_where_clause
      "#{relevant_date_column} BETWEEN '#{timeframe_start.to_fs(:db)}' AND '#{timeframe_end.to_fs(:db)}'"
    end

    def school_ids_where_clause
      "AND #{reporting_sessions_view.name}.school_id IN (#{school_ids.join(',')})"
    end

    def grades_where_clause
      return "" if grades.blank?

      <<-SQL
        AND (
          #{reporting_sessions_view.name}.grade IN (#{grades.map { |g| "'#{g}'" }.join(',')})
          #{'OR #{reporting_sessions_view.name}.grade IS NULL' if grades.include?('null')}
        )
      SQL
    end

    def teacher_ids_where_clause
      return "" if teacher_ids.blank?

      "AND #{reporting_sessions_view.name}.teacher_id IN (#{teacher_ids.join(',')})"
    end

    def classroom_ids_where_clause
      return "" if classroom_ids.blank?

      "AND #{reporting_sessions_view.name}.classroom_id IN (#{classroom_ids.join(',')})"
    end
  end
end
