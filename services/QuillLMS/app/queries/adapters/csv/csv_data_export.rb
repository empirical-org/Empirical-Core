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
        processed_result = pre_process_result(bigquery_result)
        validate_input!(processed_result, sym_columns)

        CSV.generate do |csv|
          csv << human_displayable_csv_headers(sym_columns)
          csv << human_displayable_csv_tooltips(sym_columns)
          processed_result.each { |row| add_aggregate_record_to_csv(csv, row, sym_columns) }
        end
      end

      # No pre-processing by default
      def self.pre_process_result(bigquery_result)
        bigquery_result
      end

      def self.add_aggregate_record_to_csv(csv, row, sym_columns)
        csv << sym_columns.map { |key| format_cell(key, row[key]) }
        row[:aggregate_rows].each do |agg_row|
          csv << ([:name] + sym_columns.slice(1..)).map { |key| format_cell(key, agg_row[key]) }
        end
      end

      def self.human_displayable_csv_headers(sym_columns) = sym_columns.map{|col| ordered_columns[col][0] }
      def self.human_displayable_csv_tooltips(sym_columns) = sym_columns.map{|col| ordered_columns[col][1] }

      def self.format_cell(sym_column, value)
        return (format_lambdas[sym_column].call(value)) if format_lambdas.include?(sym_column)

        value
      end

      def self.row_contains_requested_columns?(row, requested_columns)
        (row.keys & requested_columns).length == requested_columns.length
      end

      def self.validate_input!(processed_result, sym_columns)
        if (ordered_columns.keys & sym_columns).length != sym_columns.length
          raise UnhandledColumnError, "Requested column(s) not supported: #{sym_columns - ordered_columns.keys}"
        end

        processed_result.each do |row|
          next if row_contains_requested_columns?(row, sym_columns)

          raise BigQueryResultMissingRequestedColumnError, "Row keys: #{row.keys} Column keys: #{sym_columns} Missing keys: #{sym_columns - row.keys}"
        end
      end
    end
  end
end