# frozen_string_literal: true

module Evidence
  module GenAI
    class SecondaryFeedbackDataFetcher < ApplicationService
      FeedbackSet = Struct.new(:activity_id, :prompt_id, :rule_id, :label, :conjunction, :primary, :secondary, :highlights, :sample_entry, keyword_init: true) do
        def to_a
          [activity_id, prompt_id, conjunction, rule_id, label, sample_entry, primary,secondary, highlights.join(ARRAY_DELIMITER)]
        end
      end

      FILE_ALL = 'secondary_feedback_all.csv'
      FILE_TRAIN = 'secondary_feedback_train.csv'
      FILE_TEST = 'secondary_feedback_test.csv'
      CSV_FILE_PATH = "#{Evidence::Engine.root}/app/services/evidence/gen_ai/secondary_feedback_data/%<file>s"

      ARRAY_DELIMITER = '|'

      attr_reader :file

      def initialize(file = FILE_TRAIN)
        @file = file
      end

      def run = csv_data.map {|row| dataset_from_row(row) }

      private def csv_data = CSV.read(file_path, headers: true)
      private def file_path = format(CSV_FILE_PATH, file:)

      private def dataset_from_row(row)
        FeedbackSet.new(
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
