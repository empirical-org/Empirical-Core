# frozen_string_literal: true

module Evidence
  module GenAI
    module LabelFeedback
      class DataFetcher < ApplicationService
        LabeledData = Data.define(:entry, :label)

        DEFAULT_FILE = 'train.csv'
        CSV_FILE_PATH = "#{Evidence::Engine.root}/app/services/evidence/gen_ai/label_feedback/data/%<file>s"

        attr_reader :file

        def initialize(file = DEFAULT_FILE)
          @file = file
        end

        def run = csv_data.map { |row| data_from_row(row) }

        private def csv_data = CSV.read(file_path, headers: true)
        private def file_path = format(CSV_FILE_PATH, file:)

        private def data_from_row(row) = LabeledData.new(entry: row['entry'], label: row['label'])
      end
    end
  end
end
