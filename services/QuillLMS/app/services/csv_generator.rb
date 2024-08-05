# frozen_string_literal: true

require 'csv'

class CsvGenerator < ApplicationService
  class UnhandledColumnError < StandardError; end
  class DataMissingRequestedColumnError < StandardError; end

  attr_accessor :data, :specified_columns

  def initialize(data, specified_columns: nil)
    @data = data
    @specified_columns = specified_columns
  end

  def run
    validate_input!
    generate_csv
  end

  # Intentionally left public
  def ordered_columns = raise NotImplementedError

  private def generate_csv
    CSV.generate do |csv|
      add_headers_to_csv(csv)
      pre_processed_result.each { |row| add_record_to_csv(csv, row) }
    end
  end

  private def add_headers_to_csv(csv)
    # Add values if any are non-nil
    csv << csv_headers if csv_headers.compact.present?
    csv << csv_tooltips if csv_tooltips.compact.present?
  end

  private def add_record_to_csv(csv, row)
    csv << sym_columns.map { |key| format_cell(key, row[key]) }
  end

  private def validate_input!
    if (ordered_columns.keys & sym_columns).length != sym_columns.length
      raise UnhandledColumnError, "Requested column(s) not supported: #{sym_columns - ordered_columns.keys}"
    end

    pre_processed_result.each do |row|
      next if row_contains_requested_columns?(row, sym_columns)

      raise DataMissingRequestedColumnError, "Row keys: #{row.keys} Column keys: #{sym_columns} Missing keys: #{sym_columns - row.keys}"
    end
  end

  private def columns = specified_columns || ordered_columns.keys
  private def csv_headers = sym_columns.map { |col| ordered_columns[col][:csv_header] }
  private def csv_tooltips = sym_columns.map { |col| ordered_columns[col][:csv_tooltip] }
  # No pre-processing by default
  private def pre_processed_result = data
  private def sym_columns = columns.map(&:to_sym)

  private def format_cell(sym_column, value) = Formatter.run(ordered_columns.dig(sym_column, :formatter) || Formatter::DEFAULT, value)
  private def row_contains_requested_columns?(row, requested_columns) = (row.keys & requested_columns).length == requested_columns.length
end
