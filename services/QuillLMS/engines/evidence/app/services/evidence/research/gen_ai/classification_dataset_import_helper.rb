# frozen_string_literal: true

require 'csv'
require 'google/cloud/storage'

module Evidence
  module Research
    module GenAI
      class ClassificationDatasetImportHelper < ApplicationService
        attr_reader :csv_file

        AUTOML_HEADERS = [
          ['Responses', 'AutoML Labels'],
          ['Responses', 'AutoML'],
          ['response', 'label'],
          ['Responses', 'labels'],
          ['Response', 'AutoML Label'],
          ['Responses', 'Vertex Labels'],
          ['response', 'AutoML Label'],
          ['Responses', 'AutoML Label'],
          ['Responses', 'AutoML Labels', nil],
          ['Responses', 'AutoML Labels', nil, nil],
          ['response', 'label', 'Notes'],
          ['TEST', 'Response', 'Label'],
          ['TEST', 'Responses', 'AutoML Labels']
        ].freeze

        HEADER = ['entry', 'label', 'type'].freeze

        LABEL_REGEX = /^(Label|Optimal)_\d+$/

        TRAIN = 'TRAIN'
        TEST = 'TEST'
        VALIDATION = 'VALIDATION'

        DATA_PARTITIONS = [TEST, TRAIN, VALIDATION]

        def initialize(csv_file:)
          @csv_file = csv_file
        end

        def run
          CSV.parse(csv_file.read, headers: true) do |row|
            prompt_id = row['prompt_id'].to_i

            file_name = row['file_name']
            file = bucket.file(file_name)
            file_contents = file.download.read

            clean_data =
              file_contents
                .gsub("Responses,\"AutoML Feedbacks\nNote: Delete remaining cells with #Value! \"\r\n", "Responses,AutoML Labels\r\n")
                .gsub("Responses,\"AutoML Labels\nNote: Delete remaining cells with #Value!\"\r\n", "Responses,AutoML Labels\r\n")
                .gsub("Responses,\"AutoML Labels\nNote: Delete remaining cells with #Value! \"\r\n", "Responses,AutoML Labels\r\n")
                .gsub("\"Highlight Key:\nPink = regex needed for \"\"machine(s)\"\" instead of \"\"machine learning\"\"\",\r\n\"The sounds of a coral reef can help scientists monitor its health, so...\",\r\n", '')

            csv_data = CSV.parse(clean_data, headers: false)
            headers = csv_data.first

            if headers_present?(headers)
              csv_data.shift
              data = csv_data
            elsif labels_present?(headers)
              data = csv_data
            else
              puts "Prompt ID: #{prompt_id} has no headers or labels"
              puts "File name: #{file_name}"
              next
            end

            evidence_activity = Evidence::Activity.find(row['evidence_activity_id'])
            name = evidence_activity.notes
            text = evidence_activity.passages.first.text
            activity = Evidence::Research::GenAI::Activity.find_or_create_by!(name:, text:)
            prompt = Evidence::Prompt.find(prompt_id)
            stem_vault = StemVault.find_or_create_by!(activity:, conjunction: row['conjunction'].strip, stem: prompt.text)
            stem_vault.update!(prompt:)
            stem_vault.set_confusion_matrix_and_labels!
            dataset = Dataset.create!(task_type: Dataset::CLASSIFICATION, stem_vault:)

            ClassificationDatasetImporter.run(data:, prompt_id:, dataset:)
          end
        end

        private def headers_present?(headers) = headers.in?(AUTOML_HEADERS) || (headers.size == 2 && headers[1] == 'AutoML Labels')

        private def labels_present?(headers) = label?(headers[1]) || data_partion_label_format?(headers)

        private def data_partion_label_format?(headers) = headers.size == 3 && headers[0].in?(DATA_PARTITIONS) && label?(headers[2])

        private def label?(text) = text.strip.match?(LABEL_REGEX)

        private def storage = Google::Cloud::Storage.new
        private def bucket = @bucket ||= storage.bucket(GOOGLE_CLOUD_STORAGE_CSV_BUCKET)
      end
    end
  end
end
