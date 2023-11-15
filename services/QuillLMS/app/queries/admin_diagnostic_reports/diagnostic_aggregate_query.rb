# frozen_string_literal: true

module AdminDiagnosticReports
  class DiagnosticAggregateQuery < Snapshots::PeriodQuery
    class InvalidAggregationError < StandardError; end

    attr_reader :additional_aggregation

    AGGREGATION_OPTIONS = [
      'grade',
      'teacher',
      'classroom'
    ]
    DIAGNOSTIC_ORDER_BY_ID = [
      1663, # Starter Baseline Diagnostic (Pre)
      1668, # Intermediate Baseline Diagnostic (Pre)
      1678, # Advanced Baseline Diagnostic (Pre)
      1161, # ELL Starter Baseline Diagnostic (Pre)
      1568, # ELL Intermediate Baseline Diagnostic (Pre)
      1590, # ELL Advanced Baseline Diagnostic (Pre)
      992,  # AP Writing Skills Survey
      1229, #  Pre-AP Writing Skills Survey 1
      1230, # Pre-AP Writing Skills Survey 2
      1432  # SpringBoard Writing Skills Survey
    ]

    def initialize(aggregation:, **options)
      raise InvalidAggregationError, "#{aggregation} is not a valid aggregation value." unless AGGREGATION_OPTIONS.include?(aggregation)

      @additional_aggregation = aggregation

      super(**options)
    end

    def run
      post_process(run_query)
    end

    def run_query
      runner.execute(union_query)
    end

    def union_query
      <<-SQL
        WITH aggregate_rows AS (#{query})
        SELECT
          diagnostic_id,
          diagnostic_name,
          NULL as aggregate_id,
          'ROLLUP' AS name,
          group_by,
          #{rollup_aggregation_select},
        FROM aggregate_rows
        GROUP BY diagnostic_id, diagnostic_name, group_by
        UNION ALL
        SELECT *
          FROM aggregate_rows
      SQL
    end

    def select_clause
      <<-SQL
        SELECT
          activities.id AS diagnostic_id,
          activities.name AS diagnostic_name,
          #{aggregate_by_clause} AS aggregate_id,
          #{aggregate_sort_clause} AS name,
          '#{additional_aggregation}' AS group_by,
          #{specific_select_clause}
      SQL
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.classroom_units
          ON classrooms.id = classroom_units.classroom_id
        JOIN lms.users
          ON schools_users.user_id = users.id
      SQL
    end

    def specific_select_clause
      raise NotImplementedError
    end

    def where_clause
      super + <<-SQL
          #{relevant_diagnostic_where_clause}
      SQL
    end

    def relevant_diagnostic_where_clause
      "AND activities.id IN (#{DIAGNOSTIC_ORDER_BY_ID.join(',')})"
    end

    def group_by_clause
      "GROUP BY activities.id, activities.name, aggregate_id, #{aggregate_sort_clause}"
    end

    def aggregate_by_clause
      {
        'grade' => "classrooms.grade",
        'classroom' => "classrooms.id",
        'teacher' => "users.id"
      }.fetch(additional_aggregation)
    end

    def aggregate_sort_clause
      {
        'grade' => "classrooms.grade",
        'classroom' => "classrooms.name",
        'teacher' => "users.name"
      }.fetch(additional_aggregation)
    end

    private def post_process(result)
      return [] if result.empty?

      result.group_by { |row| row[:diagnostic_name] }
        .values
        .map { |diagnostic_rows| build_diagnostic_aggregates(diagnostic_rows) }
        .sort_by { |diagnostic| DIAGNOSTIC_ORDER_BY_ID.index(diagnostic[:diagnostic_id]) }
    end

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
      diagnostic_rows.sort do |a, b|
        # nils are always at the end
        next -1 if b[:name].nil?
        next 1 if a[:name].nil?
        next sort_grades(a[:name], b[:name]) if grade_aggregation?
        next sort_teachers(a[:name], b[:name]) if teacher_aggregation?

        a[:name] <=> b[:name]
      end
    end

    private def sort_grades(first, second)
      # If the grade isn't a number, or in the GRADE_INTEGERS hash, sort it to the end
      return -1 if second.to_i == 0 && !Classroom::GRADE_INTEGERS.key?(second.to_sym)
      return 1 if first.to_i == 0 && !Classroom::GRADE_INTEGERS.key?(first.to_sym)

      Classroom::GRADE_INTEGERS.fetch(first.to_sym, first).to_i <=> Classroom::GRADE_INTEGERS.fetch(second.to_sym, second).to_i
    end

    private def sort_teachers(first, second)
      # Not totally pleased with this as a sorting method, but it's what we do elsewhere for name sorting
      first.split.last <=> second.split.last
    end

    private def grade_aggregation?
      additional_aggregation == 'grade'
    end

    private def teacher_aggregation?
      additional_aggregation == 'teacher'
    end

    private def rollup_aggregation_hash
      raise NotImplementedError
    end

    private def rollup_aggregation_select
      rollup_aggregation_hash.map do |column, aggregation_function|
        aggregation_function.call(column)
      end.join(", ")
    end

    private def sum_aggregate
      -> (column) { "SUM(#{column}) AS #{column}" }
    end

    private def average_aggregate(weight_column)
      -> (column) { "SUM(#{weight_column} * #{column}) / SUM(#{weight_column}) AS #{column}" }
    end
  end
end
