# frozen_string_literal: true

require 'csv'

module Adapters
  module Csv
    class AdminDiagnosticSkillsSummaryDataExport < CsvDataExport
      class UnhandledColumnError < StandardError; end
      class BigQueryResultMissingRequestedColumnError < StandardError; end

      def self.ordered_columns
        {
          maintained_proficiency: [
            'Students Maintained Proficiency',
            "The total number of students who answered all questions for this skill correctly on both the Pre and the Post diagnostic.\n\nThis total count(”of __ students”) includes all students who completed both the Pre and the Post diagnostic and are selected in the filters."
          ]
        }
      end

      def self.format_lambdas
        {
          pre_score: format_as_integer,
          post_score: format_as_integer,
          growth_percentage: format_as_integer
        }
      end

      def self.format_as_integer = ->(x) { x.to_i }
    end
  end
end
