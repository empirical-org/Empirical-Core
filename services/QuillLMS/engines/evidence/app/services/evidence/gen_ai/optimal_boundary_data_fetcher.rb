# frozen_string_literal: true

module Evidence
  module GenAI
    class OptimalBoundaryDataFetcher < ApplicationService
      DataSet = Struct.new(:optimals, :suboptimals, keyword_init: true)

      DEFAULT_FILE = 'gen_ai_optimal_because_50.csv'
      CSV_FILE_PATH = "#{Evidence::Engine.root}/app/services/evidence/gen_ai/optimal_boundary_data/%<file>s"

      attr_reader :file

      def initialize(file = DEFAULT_FILE)
        @file = file
      end

      def run
        csv_data
          .group_by { |r| r['prompt_id'].to_i }
          .transform_values(&:first)
          .transform_values { |row| dataset_from_row(row) }
      end

      private def csv_data = CSV.read(file_path, headers: true)
      private def file_path = format(CSV_FILE_PATH, file:)

      private def dataset_from_row(row)
        DataSet.new(
          optimals: [row['optimal1'], row['optimal2']].compact,
          suboptimals: [row['suboptimal1'], row['suboptimal2']].compact
        )
      end
    end
  end
end
