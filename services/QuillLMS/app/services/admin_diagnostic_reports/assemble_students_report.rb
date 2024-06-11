# frozen_string_literal: true

module AdminDiagnosticReports
  class AssembleStudentsReport < ApplicationService
    attr_reader :payload

    DEFAULT_RECOMMENDATION = {
      completed_activities: nil,
      time_spent_seconds: nil
    }

    def initialize(payload)
      @payload = payload
    end

    def run
      base_results.map do |row|
        row.merge(recommendation_results.fetch(row[:student_id], DEFAULT_RECOMMENDATION))
      end
    end

    private def base_results = @base_results ||= DiagnosticPerformanceByStudentViewQuery.run(**payload)
    private def recommendation_results = @recommendation_results ||= DiagnosticRecommendationsByStudentQuery.run(**payload)
  end
end
