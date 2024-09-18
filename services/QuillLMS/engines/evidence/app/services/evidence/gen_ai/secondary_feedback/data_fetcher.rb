# frozen_string_literal: true

require 'csv'

module Evidence
  module GenAI
    module SecondaryFeedback
      class DataFetcher < ApplicationService
        FILE_ALL = 'secondary_feedback_all.csv'
        FILE_TRAIN = 'secondary_feedback_train.csv'
        FILE_TEST = 'secondary_feedback_test.csv'
        CSV_FILE_PATH = "#{Evidence::Engine.root}/app/services/evidence/gen_ai/secondary_feedback/data/%<file>s"

        ARRAY_DELIMITER = '|'
        UNLIMITED = 10_000
        CONJUNCTIONS = Evidence::Prompt::CONJUNCTIONS

        attr_reader :file, :conjunctions, :limit

        def initialize(file: FILE_TRAIN, conjunctions: CONJUNCTIONS, limit: UNLIMITED)
          @file = file
          @conjunctions = conjunctions
          @limit = limit
        end

        def run
          csv_data
            .map { |row| dataset_from_row(row) }
            .select { |data| data.conjunction.in?(conjunctions) }
            .first(limit)
        end

        private def csv_data = ::CSV.read(file_path, headers: true)
        private def file_path = format(CSV_FILE_PATH, file:)

        private def dataset_from_row(row)
          Evidence::GenAI::SecondaryFeedback::DataSet.new(
            activity_id: row['activity_id']&.to_i,
            rule_id: row['rule_id']&.to_i,
            prompt_id: row['prompt_id']&.to_i,
            label: row['label'],
            conjunction: row['conjunction'],
            primary: row['feedback_primary'],
            secondary: row['feedback_secondary'],
            highlights: row['highlights_secondary']&.split(ARRAY_DELIMITER) || [],
            sample_entry: row['sample_entry']
          )
        end
      end
    end
  end
end
