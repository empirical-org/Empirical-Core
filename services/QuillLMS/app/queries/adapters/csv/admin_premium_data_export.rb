# frozen_string_literal: true

require 'csv'

module Adapters
  module Csv
    class AdminPremiumDataExport < CsvDataExport
      ORDERED_COLUMNS = {
        student_name:     {csv_header: 'Student Name', formatter: Formatter::DEFAULT},
        student_email:    {csv_header: 'Student Email', formatter: Formatter::DEFAULT},
        completed_at:     {csv_header: 'Completed Date', formatter: Formatter::DATE},
        activity_name:    {csv_header: 'Activity', formatter: Formatter::DEFAULT},
        activity_pack:    {csv_header: 'Activity Pack', formatter: Formatter::DEFAULT},
        score:            {csv_header: 'Score', formatter: Formatter::SCORE_OR_COMPLETED},
        timespent:        {csv_header: 'Time Spent (Mins)', formatter: Formatter::SECONDS_TO_MINUTES},
        standard:         {csv_header: 'Standard', formatter: Formatter::DEFAULT},
        tool:             {csv_header: 'Tool', formatter: Formatter::DEFAULT},
        school_name:      {csv_header: 'School', formatter: Formatter::DEFAULT},
        classroom_grade:  {csv_header: 'Grade', formatter: Formatter::DEFAULT},
        teacher_name:     {csv_header: 'Teacher', formatter: Formatter::DEFAULT},
        classroom_name:   {csv_header: 'Class', formatter: Formatter::DEFAULT},
      }.freeze

      def self.ordered_columns = ORDERED_COLUMNS

      def self.to_csv_string(bigquery_result, columns = ordered_columns.keys)
        sym_columns = columns.map(&:to_sym)
        validate_input!(bigquery_result, sym_columns)

        CSV.generate do |csv|
          csv << csv_headers(sym_columns)
          bigquery_result.each do |row|
            csv << sym_columns.map { |key| format_cell(key, row[key]) }
          end
        end
      end
    end
  end
end
