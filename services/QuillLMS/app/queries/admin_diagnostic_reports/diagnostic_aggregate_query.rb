# frozen_string_literal: true

module AdminDiagnosticReports
  class DiagnosticAggregateQuery < Snapshots::PeriodQuery
    class InvalidAggregationError < StandardError; end

    attr_reader :additional_aggregation

    DIAGNOSTIC_CLASSIFICATION_ID = 4
    AGGREGATION_OPTIONS = [
      'grade',
      'teacher', 
      'classroom'
    ]
    DIAGNOSTIC_ORDER_BY_NAME = [

    ]

    def initialize(aggregation:, **options)
      raise InvalidAggregationError.new("#{aggregation} is not a valid aggregation value.") unless AGGREGATION_OPTIONS.include?(aggregation)

      @additional_aggregation = aggregation

      super(**options)
    end

    def run
      post_process(run_query)
    end

    def select_clause
      <<-SQL
        SELECT
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
          #{activity_classification_where_clause}
      SQL
    end

    def activity_classification_where_clause
      "AND activities.activity_classification_id = #{DIAGNOSTIC_CLASSIFICATION_ID}"
    end

    def group_by_clause
      "GROUP BY activities.name, #{aggregation_clause}"
    end

    def aggregation_clause
      {
        'grade' => "classrooms.grade",
        'classroom' => "classrooms.name",
        'teacher' => "users.name"
      }.fetch(@additional_aggregation)
    end

    private def post_process(result)
      result.group_by { |row| row[:diagnostic_name] }
        .values
        .map do |diagnostic_rows|
          {
            name: diagnostic_rows.first[:diagnostic_name],
            aggregate_rows: process_aggregate_rows(diagnostic_rows)
          }.merge(aggregate_diagnostic(diagnostic_rows))
        end
        .sort_by { |diagnostic| DIAGNOSTIC_ORDER_BY_NAME.index(diagnostic[:diagnostic_name]) }
    end

    private def process_aggregate_rows(diagnostic_rows)
      diagnostic_rows.sort do |a, b|
        # nils are always at the end
        if b.nil?
         -1 if b.nil?
        else
          # if we're sorting by grade, convert named grades to integers, otherwise just sort by the raw value
          Classroom::GRADE_INTEGERS.fetch(a[:name], a[:name]) <=> Classroom::GRADE_INTEGERS.fetch(b[:name], b[:name])
        end
      end
      # Make grade information more human-readable
      .each do |row|
        return unless @additional_aggregation == 'grade'

        return row[:name] = "No grade selected" if row[:name].nil?

        # remember that to_i returns 0 for non-numeric strings
        row[:name] = "Grade #{row[:name]}" if row[:name].to_i > 0
      end
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
