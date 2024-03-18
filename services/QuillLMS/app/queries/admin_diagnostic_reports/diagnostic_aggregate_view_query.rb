# frozen_string_literal: true

module AdminDiagnosticReports
  class DiagnosticAggregateViewQuery < ::QuillBigQuery::MaterializedViewQuery
    class InvalidAggregationError < StandardError; end

    attr_reader :timeframe_start, :timeframe_end, :school_ids, :grades, :teacher_ids, :classroom_ids, :user, :additional_aggregation

    AGGREGATE_COLUMN = :diagnostic_id
    AGGREGATION_OPTIONS = DiagnosticAggregateQuery::AGGREGATION_OPTIONS
    DIAGNOSTIC_ORDER_BY_ID = DiagnosticAggregateQuery::DIAGNOSTIC_ORDER_BY_ID

    def initialize(timeframe_start:, timeframe_end:, school_ids:, aggregation:, grades: nil, teacher_ids: nil, classroom_ids: nil, user: nil, **options) # rubocop:disable Metrics/ParameterLists
      raise InvalidAggregationError, "#{aggregation} is not a valid aggregation value." unless valid_aggregation_options.include?(aggregation)

      @timeframe_start = timeframe_start
      @timeframe_end = timeframe_end
      @school_ids = school_ids
      @grades = grades
      @teacher_ids = teacher_ids
      @classroom_ids = classroom_ids
      @user = user
      @additional_aggregation = aggregation

      super(**options)
    end

    def materialized_views = [active_classroom_stubs_view, active_user_names_view, performance_view]

    def active_classroom_stubs_view = materialized_view('active_classroom_stubs_view')
    def active_user_names_view = materialized_view('active_user_names_view')
    def performance_view = materialized_view('pre_post_diagnostic_skill_group_performance_view')

    def run
      post_process(run_query)
    end

    def query
      <<-SQL
        WITH #{with_sql}
        #{contextual_query}
      SQL
    end

    def with_sql
      with_queries.map do |name, query|
        "#{name} AS (#{query})"
      end.join(",\n")
    end

    def with_queries = { aggregate_rows: root_query }

    def contextual_query
      <<-SQL
        SELECT
          #{rollup_select_columns},
          NULL as aggregate_id,
          'ROLLUP' AS name,
          group_by,
          #{rollup_aggregation_select}
        FROM aggregate_rows
        GROUP BY #{rollup_select_columns}, group_by
        UNION ALL
        SELECT *
          FROM aggregate_rows
      SQL
    end

    def select_clause
      <<-SQL
        SELECT
          performance.activity_id AS diagnostic_id,
          activities.name AS diagnostic_name,
          #{aggregate_by_clause} AS aggregate_id,
          #{aggregate_sort_clause} AS name,
          '#{additional_aggregation}' AS group_by,
          #{specific_select_clause}
      SQL
    end

    def from_and_join_clauses
      <<-SQL
        FROM lms.pre_post_diagnostic_skill_group_performance_view AS performance
        JOIN lms.active_classroom_stubs_view AS classrooms ON performance.classroom_id = classrooms.id
        JOIN lms.classrooms_teachers ON classrooms.id = classrooms_teachers.classroom_id AND classrooms_teachers.role = 'owner'
        JOIN lms.schools_users ON classrooms_teachers.user_id = schools_users.user_id
        JOIN lms.activities ON performance.activity_id = activities.id
        JOIN lms.active_user_names_view AS users ON classrooms_teachers.user_id = users.id
      SQL
    end

    def where_clause
      <<-SQL
        WHERE
          #{timeframe_where_clause}
          #{classroom_ids_where_clause}
          #{grades_where_clause}
          #{owner_teachers_only_where_clause}
          #{relevant_diagnostic_where_clause}
          #{school_ids_where_clause}
          #{teacher_ids_where_clause}
      SQL
    end

    def rollup_select_columns = "diagnostic_id, diagnostic_name"
    def specific_select_clause = raise NotImplementedError

    def timeframe_where_clause = "#{relevant_date_column} BETWEEN '#{timeframe_start.to_fs(:db)}' AND '#{timeframe_end.to_fs(:db)}'"
    def classroom_ids_where_clause = ("AND classrooms.id IN (#{classroom_ids.join(',')})" if classroom_ids.present?)
    def grades_where_clause = ("AND (classrooms.grade IN (#{grades.map { |g| "'#{g}'" }.join(',')}) #{grades_where_null_clause})" if grades.present?)
    def grades_where_null_clause = ("OR classrooms.grade IS NULL" if grades.include?('null'))
    def owner_teachers_only_where_clause = "AND classrooms_teachers.role = '#{ClassroomsTeacher::ROLE_TYPES[:owner]}'"
    def relevant_diagnostic_where_clause = "AND performance.activity_id IN (#{DIAGNOSTIC_ORDER_BY_ID.join(',')})"
    def school_ids_where_clause = "AND schools_users.school_id IN (#{school_ids.join(',')})"
    def teacher_ids_where_clause = ("AND schools_users.user_id IN (#{teacher_ids.join(',')})" if teacher_ids.present?)

    def group_by_clause = "GROUP BY performance.activity_id, activities.name, aggregate_id, #{aggregate_sort_clause}"

    def aggregate_by_clause
      {
        'grade' => "classrooms.grade",
        'classroom' => "classrooms.id",
        'teacher' => "users.id",
        'student' => "CONCAT(classrooms.id, ':', students.id)"
      }.fetch(additional_aggregation)
    end

    def aggregate_sort_clause
      {
        'grade' => "classrooms.grade",
        'classroom' => "classrooms.name",
        'teacher' => "users.name",
        'student' => "students.name"
      }.fetch(additional_aggregation)
    end

    private def post_process(result)
      return [] if result.empty?

      result.group_by { |row| row[self.class::AGGREGATE_COLUMN] }
        .values
        .map { |group_rows| build_diagnostic_aggregates(group_rows) }
        .sort_by { |group| group_sort_by(group) }
    end

    private def group_sort_by(group) = DIAGNOSTIC_ORDER_BY_ID.index(group[:diagnostic_id])

    private def build_diagnostic_aggregates(diagnostic_rows)
      overview_row_index = diagnostic_rows.find_index { |row| row[:name] == 'ROLLUP' }
      overview_row = diagnostic_rows.delete_at(overview_row_index)
      overview_row.merge({
        aggregate_rows: process_aggregate_rows(diagnostic_rows)
      })
    end

    private def process_aggregate_rows(diagnostic_rows)
      aggregate_sort(diagnostic_rows)
        .map do |row|
          # Make grade information more human-readable than simple integers
          next row unless grade_aggregation?
          next row.merge({name: "No grade selected"}) if row[:name].nil?
          # to_i returns 0 for non-numeric strings, so this will only apply to numbered grades
          next row.merge({name: "Grade #{row[:name]}"}) if row[:name].to_i > 0

          row
        end
    end

    private def aggregate_sort(diagnostic_rows)
      diagnostic_rows.sort_by do |row|
        next sort_grades(row[:name]) if grade_aggregation?
        next sort_teachers(row[:name]) if teacher_aggregation?

        row[:name]
      end
    end

    private def sort_grades(name)
      # If the grade isn't a number, or in the GRADE_INTEGERS hash, sort it to the end
      last_grade = Classroom::GRADE_INTEGERS.values.max
      # Nils always at the end
      return last_grade + 2 if name.nil?
      # Any other value before nils but after everything else
      return last_grade + 1 if name.to_i == 0 && !Classroom::GRADE_INTEGERS.key?(name.to_sym)

      Classroom::GRADE_INTEGERS.fetch(name.to_sym, name).to_i
    end

    private def sort_teachers(name) = name.split(" ", 2).last
    private def valid_aggregation_options = AGGREGATION_OPTIONS
    private def grade_aggregation? = additional_aggregation == 'grade'
    private def teacher_aggregation? = additional_aggregation == 'teacher'
    private def rollup_aggregation_hash = (raise NotImplementedError)

    private def rollup_aggregation_select
      rollup_aggregation_hash.map do |column, aggregation_function|
        aggregation_function.call(column)
      end.join(", ")
    end

    private def average_aggregate(weight_column) = ->(column) { "SUM(#{weight_column} * #{column}) / SUM(#{weight_column}) AS #{column}" }
    private def naive_average_aggregate = ->(column) { "AVG(#{column}) AS #{column}" }
    private def percentage_aggregate(numerator_column, denominator_column) = ->(column) { "SUM(#{numerator_column}) / SUM(#{denominator_column}) * 100 AS #{column}" }
    private def static_string(value) = ->(column) { "'#{value}' AS #{column}" }
    private def sum_aggregate = ->(column) { "SUM(#{column}) AS #{column}" }
  end
end
