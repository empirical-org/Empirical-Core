# frozen_string_literal: true

require 'csv'

module Adapters
  module Csv
    class AdminPremiumDataExport
      class UnhandledColumnError < StandardError; end

      ORDERED_COLUMNS = %i(
        student_name
        student_email
        completed_at
        activity_name
        activity_pack
        activity_session_id
        score
        timespent
        standard
        tool
        school_name
        classroom_grade
        teacher_name
        classroom_name
        student_id
        classroom_id
      )

      def self.to_csv_string(bigquery_result, columns = ORDERED_COLUMNS)
        sym_columns = columns.map(&:to_sym)
        validate_input!(bigquery_result)

        CSV.generate do |csv|
          csv << sym_columns.map(&:to_s)
          bigquery_result.each do |row|
            csv << sym_columns.map { |key| row[key] }
          end
        end
      end

      def self.validate_input!(bigquery_result)
        bigquery_result.each do |row|
          next if (row.keys - ORDERED_COLUMNS).empty?

          raise UnhandledColumnError, "Unhandled column(s): #{row.keys - ORDERED_COLUMNS}"
        end
      end
    end

  end
end
