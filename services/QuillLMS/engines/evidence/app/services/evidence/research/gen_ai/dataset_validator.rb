# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class DatasetValidator < ApplicationService
        attr_reader :file

        OPTIMAL = HasAssignedStatus::OPTIMAL
        SUBOPTIMAL = HasAssignedStatus::SUBOPTIMAL
        MISSING_FEEDBACK_ERROR = 'is missing feedback. Please add Curriculum Proposed Feedback or AutoML Primary Feedback.'

        def initialize(file:)
          @file = file
        end

        def run
          [].tap do |errors|
            CSV.parse(file.read, headers: true).each.with_index(2) do |row, index|
              next if row['Curriculum Assigned Optimal Status'] == 'TRUE'
              next if row['Data Partition'] == 'prompt'
              next if row['Curriculum Proposed Feedback'].present? || row['Optional - AutoML Primary Feedback'].present?

              errors << "Row #{index}: #{MISSING_FEEDBACK_ERROR}"
            end

            file.rewind

            errors.empty? ? nil : errors.join(",\n")
          end
        end
      end
    end
  end
end
