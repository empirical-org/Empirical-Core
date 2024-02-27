# frozen_string_literal: true

module Snapshots
  class ReportingSessionQuery < ::QuillBigQuery::MaterializedViewQuery
    attr_reader :timeframe_start, :timeframe_end, :school_ids, :grades, :teacher_ids, :classroom_ids, :user

    def initialize(timeframe_start:, timeframe_end:, school_ids:, grades: nil, teacher_ids: nil, classroom_ids: nil, user: nil, **options)
      @timeframe_start = timeframe_start
      @timeframe_end = timeframe_end
      @school_ids = school_ids
      @grades = grades
      @teacher_ids = teacher_ids
      @classroom_ids = classroom_ids
      @user = user

      super(**options)
    end

    def materialized_view_keys = ['reporting_sessions_view']

    # only has one mat view
    private def materialized_view = materialized_views.first

    def from_and_join_clauses
      "FROM #{materialized_view.name_with_dataset}"
    end

    def relevant_date_column
      "#{materialized_view.name}.completed_date"
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
      "AND #{materialized_view.name}.school_id IN (#{school_ids.join(',')})"
    end

    def grades_where_clause
      return "" if grades.blank?

      <<-SQL
        AND (
          #{materialized_view.name}.grade IN (#{grades.map { |g| "'#{g}'" }.join(',')})
          #{'OR #{materialized_view.name}.grade IS NULL' if grades.include?('null')}
        )
      SQL
    end

    def teacher_ids_where_clause
      return "" if teacher_ids.blank?

      "AND #{materialized_view.name}.teacher_id IN (#{teacher_ids.join(',')})"
    end

    def classroom_ids_where_clause
      return "" if classroom_ids.blank?

      "AND #{materialized_view.name}.classroom_id IN (#{classroom_ids.join(',')})"
    end
  end
end
