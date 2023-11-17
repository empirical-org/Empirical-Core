# frozen_string_literal: true

require 'csv'

module Adapters
  module Csv
    class AdminPremiumDataExport
      class UnhandledColumnError < StandardError; end
      class BigQueryResultMissingRequestedColumnError < StandardError; end

      ORDERED_COLUMNS = {
        student_name:     'Student Name',
        student_email:    'Student Email',
        completed_at:     'Completed Date',
        activity_name:    'Activity',
        activity_pack:    'Activity Pack',
        score:            'Score',
        timespent:        'Time Spent (Mins)',
        standard:         'Standard',
        tool:             'Tool',
        school_name:      'School',
        classroom_grade:  'Grade',
        teacher_name:     'Teacher',
        classroom_name:   'Class',
      }

      def self.to_csv_string(bigquery_result, columns = ORDERED_COLUMNS.keys)
        sym_columns = columns.map(&:to_sym)
        validate_input!(bigquery_result, sym_columns)

        CSV.generate do |csv|
          csv << human_displayable_csv_headers(sym_columns)
          bigquery_result.each do |row|
            csv << sym_columns.map { |key| format_cell(key, row[key]) }
          end
        end
      end

      def self.human_displayable_csv_headers(sym_columns)
        sym_columns.map{|col| ORDERED_COLUMNS[col] }
      end

      def self.format_score(score)
        return '' unless score.is_a?(Numeric)
        return 'Completed' if score == -1
        "#{(score*100).round(0)}%"
      end

      def self.format_timespent(timespent)
        return '< 1' if timespent < 60
        (timespent / 60)
      end

      def self.format_cell(sym_column, value)
        case sym_column
        when :completed_at
          value&.strftime("%F")
        when :timespent
          format_timespent(value)
        when :score
          format_score(value)
        else
          value
        end
      end

      def self.row_contains_requested_columns?(row, requested_columns)
        (row.keys & requested_columns).length == requested_columns.length
      end

      def self.validate_input!(bigquery_result, sym_columns)
        if (ORDERED_COLUMNS.keys & sym_columns).length != sym_columns.length
          raise UnhandledColumnError, "Requested column(s) not supported: #{sym_columns - ORDERED_COLUMNS.keys}"
        end

        bigquery_result.each do |row|
          next if row_contains_requested_columns?(row, sym_columns)

          raise BigQueryResultMissingRequestedColumnError, "Row keys: #{row.keys} Column keys: #{sym_columns}"
        end
      end
    end

  end
end
