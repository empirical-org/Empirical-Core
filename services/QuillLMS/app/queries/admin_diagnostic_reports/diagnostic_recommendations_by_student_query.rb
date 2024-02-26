# frozen_string_literal: true

module AdminDiagnosticReports
  class DiagnosticRecommendationsByStudentQuery < DiagnosticRecommendationsQuery
    class InvalidDiagnosticIdError < StandardError; end

    attr_reader :diagnostic_id

    def initialize(diagnostic_id:, **options)
      raise InvalidDiagnosticIdError, "#{diagnostic_id} is not a valid diagnostic_id value." unless DIAGNOSTIC_ORDER_BY_ID.include?(diagnostic_id.to_i)

      @diagnostic_id = diagnostic_id

      super(aggregation: 'student', **options)
    end

    def from_and_join_clauses
      <<-SQL
        #{super}
        JOIN lms.users AS students ON activity_sessions.user_id = students.id
      SQL
    end

    def contextual_query
      <<-SQL
        SELECT *
          FROM aggregate_rows
      SQL
    end

    def order_by_clause
      <<-SQL
        ORDER BY TRIM(SUBSTR(TRIM(students.name), STRPOS(students.name, ' ') + 1))
      SQL
    end

    def limit_clause
      <<-SQL
        LIMIT 500
      SQL
    end

    def relevant_diagnostic_where_clause
      "AND activities.id = #{diagnostic_id}"
    end

    private def post_query_transform(results)
      results.to_h do |result|
        [result[:aggregate_id], {completed_activities: result[:average_practice_activities_count], time_spent_seconds: result[:average_time_spent_seconds]}]
      end
    end

    private def valid_aggregation_options
      ['student']
    end

    private def post_process(result)
      result
    end
  end
end
