# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class DatasetValidator < ApplicationService
        attr_reader :file

        HEADERS = DatasetImporter::HEADERS

        OPTIMAL = HasAssignedStatus::OPTIMAL
        SUBOPTIMAL = HasAssignedStatus::SUBOPTIMAL
        MISSING_FEEDBACK_ERROR = 'CSV is missing feedback. Please add Curriculum Proposed Feedback or AutoML Primary Feedback.'
        MISSING_STUDENT_RESPONSE_ERROR = 'is missing a Student Response.'
        MISSING_HEADERS_ERROR = 'CSV is missing required headers: %s.'

        def initialize(file:)
          @file = file
        end

        def run
          return headers_error if missing_headers.any?

          [].tap do |errors|
            csv.each.with_index(2) do |row, index|
              errors << "Row #{index}: #{MISSING_STUDENT_RESPONSE_ERROR}" if missing_student_response?(row)
              errors << "Row #{index}: #{MISSING_FEEDBACK_ERROR}" if missing_feedback?(row)
            end

            file.rewind

            errors.empty? ? nil : errors.join(",\n")
          end
        end

        private def csv = @csv ||= CSV.parse(file.read, headers: true)

        private def headers_error = format(MISSING_HEADERS_ERROR, missing_headers.join(', '))

        private def missing_headers = HEADERS - csv.headers

        private def missing_student_response?(row) = row['Student Response'].blank?

        private def missing_feedback?(row)
          row['Curriculum Assigned Optimal Status'] == 'FALSE' &&
          row['Data Partition'] == 'test' &&
          row['Curriculum Proposed Feedback'].blank? &&
          row['Optional - AutoML Primary Feedback'].blank?
        end
      end
    end
  end
end
