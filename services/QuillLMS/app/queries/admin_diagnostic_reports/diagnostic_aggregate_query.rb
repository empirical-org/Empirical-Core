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
      1590  # ELL Advanced Baseline Diagnostic (Pre)
    ]

    def initialize(aggregation:, **options)
      raise InvalidAggregationError, "#{aggregation} is not a valid aggregation value." unless AGGREGATION_OPTIONS.include?(aggregation)

      @additional_aggregation = aggregation

      super(**options)
    end

    def run
      post_process(run_query)
    end

    def select_clause
      <<-SQL
        SELECT
          activities.id AS diagnostic_id,
          activities.name AS diagnostic_name,
          #{aggregation_clause} AS name,
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
      "GROUP BY activities.id, activities.name, #{aggregation_clause}"
    end

    def aggregation_clause
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
      {
        id: diagnostic_rows.first[:diagnostic_id],
        name: diagnostic_rows.first[:diagnostic_name],
        group_by: additional_aggregation,
        aggregate_rows: process_aggregate_rows(diagnostic_rows)
      }.merge(aggregate_diagnostic(diagnostic_rows))
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

        a[:name] <=> b[:name]
      end
    end

    private def sort_grades(first, second)
      # If the grade isn't a number, or in the GRADE_INTEGERS hash, sort it to the end
      return -1 if second.to_i == 0 && !Classroom::GRADE_INTEGERS.key?(second.to_sym)
      return 1 if first.to_i == 0 && !Classroom::GRADE_INTEGERS.key?(first.to_sym)

      Classroom::GRADE_INTEGERS.fetch(first.to_sym, first).to_i <=> Classroom::GRADE_INTEGERS.fetch(second.to_sym, second).to_i
    end

    private def grade_aggregation?
      additional_aggregation == 'grade'
    end

    private def aggregate_diagnostic(diagnostic_rows)
      raise NotImplementedError
    end

    # Used in `aggregate_diagnostic` implementations
    private def roll_up_sum(rows, column)
      rows.map { |row| row[column.to_sym] }.sum
    end

    # Used in `aggregate_diagnostic` implementations
    private def roll_up_average(rows, value_column, weight_column)
      total_weighted_value, total_weight = rows.reduce([0, 0]) do |accumulator, row|
        [
          accumulator[0] + (row[value_column] * row[weight_column]),
          accumulator[1] + row[weight_column]
        ]
      end
      total_weighted_value.to_f / total_weight
    end
  end
end
