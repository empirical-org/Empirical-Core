# frozen_string_literal: true

require 'csv'

module Adapters
  module Csv
    class CsvDataExport
      class UnhandledColumnError < StandardError; end
      class BigQueryResultMissingRequestedColumnError < StandardError; end

      def self.ordered_columns = raise NotImplementedError
      def self.second_row_tooltips = raise NotImplementedError
      def self.format_lambdas = raise NotImplementedError

      def self.to_csv_string(bigquery_result, columns = ordered_columns.keys)
        sym_columns = columns.map(&:to_sym)
        validate_input!(bigquery_result, sym_columns)

        CSV.generate do |csv|
          csv << human_displayable_csv_headers(sym_columns)
          csv << human_displayable_csv_tooltips(sym_columns)
          bigquery_result.each do |row|
            csv << sym_columns.map { |key| format_cell(key, row[key]) }
            row[:aggregate_rows].each do |agg_row|
              csv << (['name'] + sym_columns.slice(1..)).map { |key| format_cell(key, row[key]) }
            end
          end
        end
      end

      def self.human_displayable_csv_headers(sym_columns) = sym_columns.map{|col| ordered_columns[col][0] }
      def self.human_displayable_csv_tooltips(sym_columns) = sym_columns.map{|col| ordered_columns[col][1] }

      def self.format_cell(sym_column, value)
#        return format_lambdas[sym_column](value) if format_lambdas.include?(sym_column)

        value
      end

      def self.row_contains_requested_columns?(row, requested_columns)
        (row.keys & requested_columns).length == requested_columns.length
      end

      def self.validate_input!(bigquery_result, sym_columns)
        if (ordered_columns.keys & sym_columns).length != sym_columns.length
          raise UnhandledColumnError, "Requested column(s) not supported: #{sym_columns - ordered_columns.keys}"
        end

        bigquery_result.each do |row|
          next if row_contains_requested_columns?(row, sym_columns)

          raise BigQueryResultMissingRequestedColumnError, "Row keys: #{row.keys} Column keys: #{sym_columns}"
        end
      end
    end
  end
end
