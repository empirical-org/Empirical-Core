# frozen_string_literal: true

module AdminDiagnosticReports
  class DiagnosticAggregateQuery < Snapshots::PeriodQuery
    class InvalidAdditionalAggregationError < StandardError; end

    attr_reader :additional_aggregation

    DIAGNOSTIC_CLASSIFICATION_ID = 4

    def initialize(additional_aggregation: nil, **options)
      @additional_aggregation = additional_aggregation

      super(**options)
    end

    def select_clause
      <<-SQL
        SELECT
          activities.name,
          #{specific_select_clause}
      SQL
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.classroom_units
          ON classrooms.id = classroom_units.classroom_id
      SQL
    end

    def specific_select_clause
      raise NotImplementedError
    end

    def group_by_clause
      "GROUP BY activities.name #{additional_aggregation_group_by_clause}"
    end

    def additional_aggregation_group_by_clause
      return "" if @additional_aggregation.nil?

      raise NotImplementedError

      validate_additional_aggregation

      aggregation_clauses[@additional_aggregation]
    end

    def aggregation_clauses
      {
        "grade": ", classrooms.grade",
        "teacher": ", users.id, users.name",
        "classroom": ", classrooms.id, classrooms.name"
      }
    end

    def validate_additional_aggregation
      return if aggregation_clauses.include?(@additional_aggregation)

      raise InvalidAdditionalAggregationError, "Additional aggregation must be one of #{aggregation_clauses.keys.join(',')}."
    end
  end
end
