# frozen_string_literal: true

require 'csv'
require 'google/cloud/storage'

module Evidence
  module Research
    module GenAI
      class FooCleaner < ApplicationService
        attr_reader :csv_file

        AUTOML_HEADERS = [
          ['Responses', 'AutoML Labels'],
          ['response', 'label'],
          ['Response', 'AutoML Label'],
          ['Responses', 'Vertex Labels'],
          ['response', 'AutoML Label'],
          ['Responses', 'AutoML Label'],
          ['Responses', 'AutoML Labels', nil],
          ['response', 'label', 'Notes']
        ].freeze

        HEADER = ['entry', 'label', 'type'].freeze

        LABEL_REGEX = /^(Label|Optimal)_\d+$/

        def initialize(csv_file:)
          @csv_file = csv_file
        end

        MALFORMED_CSV_IDS = [189, 253, 254, 255, 637, 638, 639, 675]
        TRAIN_IDS = [448, 449, 450, 526, 527, 528, 571, 572, 679, 681, 728, 729, 742, 743, 744, 747, 752, 753]
        VALIDATION_IDS = [745, 746, 751]
        TEST_IDS = [680, 727]

        SKIPPED_IDS = MALFORMED_CSV_IDS + TRAIN_IDS + VALIDATION_IDS + TEST_IDS

        # Headers present: 62
        # Labels present: 153

        def run
          CSV.parse(csv_file.read, headers: true) do |row|
            prompt_id = row['prompt_id'].to_i
            next if prompt_id.in?(SKIPPED_IDS)

            file_name = row['file_name']
            file = bucket.file(file_name)
            file_contents = file.download.read

            csv_data = CSV.parse(file_contents, headers: false)
            headers = csv_data.first

            if headers_present?(headers)
              csv_data.shift
              data = csv_data
            elsif labels_present?(headers)
              data = csv_data
            else
              puts "Prompt ID: #{prompt_id} has no headers or labels"
              next
            end

            evidence_activity = Evidence::Activity.find(row['evidence_activity_id'])
            name = evidence_activity.notes
            text = evidence_activity.passages.first.text
            activity = Evidence::Research::GenAI::Activity.find_or_create_by!(name:, text:)
            prompt = Evidence::Prompt.find(prompt_id)
            stem_vault = StemVault.find_or_create_by!(activity:, conjunction: row['conjunction'].strip, stem: prompt.text)
            stem_vault.update!(prompt:)
            dataset = Dataset.create!(task_type: Dataset::CLASSIFICATION, stem_vault:)

            FooFormatter.run(data:, prompt_id:, dataset:)
          end
        end

        private def headers_present?(headers) = headers.in?(AUTOML_HEADERS) || (headers.size == 2 && headers[1] == 'AutoML Labels')
        private def labels_present?(headers) = label?(headers[1])

        private def label?(text) = text.strip.match?(LABEL_REGEX)

        private def storage = Google::Cloud::Storage.new
        private def bucket = @bucket ||= storage.bucket(GOOGLE_CLOUD_STORAGE_CSV_BUCKET)
      end
    end
  end
end
