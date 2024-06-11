# frozen_string_literal: true

module AdminDiagnosticReports
  class AssembleSkillsReport < ApplicationService
    attr_reader :payload

    def initialize(payload)
      @payload = payload
    end
  
    def run
      # This query needs no assembly, everything is available from one query
      # Still putting it in a service for the sake of consistency and potential future expansion
      DiagnosticPerformanceBySkillViewQuery.run(**payload)
    end
  end
end
