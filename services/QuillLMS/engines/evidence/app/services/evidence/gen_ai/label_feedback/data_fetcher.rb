# frozen_string_literal: true

module Evidence
  module GenAI
    module LabelFeedback
      class DataFetcher < ApplicationService
        LabeledData = Data.define(:entry, :label, :label_transformed)

        DEFAULT_FILE = 'train.csv'
        CSV_FILE_PATH = "#{Evidence::Engine.root}/app/services/evidence/gen_ai/label_feedback/data/%<prompt_id>s/%<file>s"

        attr_reader :file, :prompt_id

        def initialize(prompt_id:, file: DEFAULT_FILE)
          @prompt_id = prompt_id
          @file = file
        end

        def run = csv_data.map { |row| data_from_row(row) }

        private def csv_data = CSV.read(file_path, headers: true)
        private def file_path = format(CSV_FILE_PATH, file:, prompt_id:)

        private def data_from_row(row)
          LabeledData.new(
            entry: row['entry'],
            label: row['label'],
            label_transformed: row['label_transformed']
          )
        end
      end
    end
  end
end
