# frozen_string_literal: true

module Evidence
  module GenAI
    class SecondaryFeedbackDataFetcher < ApplicationService
      FeedbackSet = Struct.new(:prompt_id, :primary, :secondary, keyword_init: true)

      DEFAULT_FILE = 'secondary_feedback_train.csv'
      TEST_FILE = 'secondary_feedback_test.csv'
      CSV_FILE_PATH = "#{Evidence::Engine.root}/app/services/evidence/gen_ai/secondary_feedback_data/%<file>s"

      attr_reader :file

      def initialize(file = DEFAULT_FILE)
        @file = file
      end

      def run = csv_data.map {|row| dataset_from_row(row) }

      private def csv_data = CSV.read(file_path, headers: true)
      private def file_path = format(CSV_FILE_PATH, file:)

      private def dataset_from_row(row)
        FeedbackSet.new(
          prompt_id: row['prompt_id'],
          primary: row['feedback_primary'],
          secondary: row['feedback_secondary']
        )
      end
    end
  end
end
