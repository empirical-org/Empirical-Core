# frozen_string_literal: true

module AdminDiagnosticReports
  class DiagnosticAggregateQuery < Snapshots::PeriodQuery
    class InvalidAggregationError < StandardError; end

    attr_reader :additional_aggregation

    AGGREGATE_COLUMN = :diagnostic_id
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
        WITH #{with_sql}
        #{contextual_query}
      SQL
    end

    def with_sql
      with_queries.map do |name, query|
        "#{name} AS (#{query})"
      end.join(",\n")
    end

    def with_queries
      {
        aggregate_rows: query
      }
    end

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
          activities.id AS diagnostic_id,
          activities.name AS diagnostic_name,
          #{aggregate_by_clause} AS aggregate_id,
          #{aggregate_sort_clause} AS name,
          '#{additional_aggregation}' AS group_by,
          #{specific_select_clause}
      SQL
    end

    def rollup_select_columns
      "diagnostic_id, diagnostic_name"
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

      result.group_by { |row| row[self.class::AGGREGATE_COLUMN] }
        .values
        .map { |group_rows| build_diagnostic_aggregates(group_rows) }
        .sort_by { |group| group_sort_by(group) }
    end

    private def group_sort_by(group)
      DIAGNOSTIC_ORDER_BY_ID.index(group[:diagnostic_id])
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

    private def sort_teachers(name)
      # Not totally pleased with this as a sorting method, but it's what we do elsewhere for name sorting
      name.split.last
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

    private def percentage_aggregate(numerator_column, denominator_column)
      -> (column) { "SUM(#{numerator_column}) / SUM(#{denominator_column}) * 100 AS #{column}" }
    end
  end
end
