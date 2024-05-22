# frozen_string_literal: true

require 'csv'

module Adapters
  module Csv
    class AdminDiagnosticStudentsSummaryDataExport < CsvDataExport
      class UnhandledColumnError < StandardError; end
      class BigQueryResultMissingRequestedColumnError < StandardError; end

      def self.add_aggregate_record_to_csv(csv, row, sym_columns)
        processed_row = pre_process_row(row)
        csv << sym_columns.map { |key| format_cell(key, processed_row[key]) }
      end

      def self.pre_process_result(bigquery_result)
        bigquery_result.map { |row| pre_process_row(row) }
      end

      def self.pre_process_row(row)
        row.merge({
          pre_questions_ratio: [row[:pre_questions_correct], row[:pre_questions_total]],
          pre_skills_proficient_ratio: [row[:pre_skills_proficient], row[:pre_skills_proficient] + row[:pre_skills_to_practice]],
          pre_skills_proficient_list: filter_and_list_skills(row[:aggregate_rows], :pre_skills_proficient),
          pre_skills_to_practice_list: filter_and_list_skills(row[:aggregate_rows], :pre_skills_to_practice),
          post_questions_ratio: [row[:post_questions_correct], row[:post_questions_total]],
          post_skills_improved_or_maintained_ratio: [row[:post_skills_improved_or_maintained], row[:post_skills_improved_or_maintained] + row[:post_skills_to_practice]],
          post_skills_improved_list: filter_and_list_skills(row[:aggregate_rows], :post_skills_improved),
          post_skills_maintained_list: filter_and_list_skills(row[:aggregate_rows], :post_skills_maintained),
          post_skills_to_practice_list: filter_and_list_skills(row[:aggregate_rows], :post_skills_to_practice)
        })
      end

      def self.filter_and_list_skills(rows, filter_key)
        rows.filter{|row| row[filter_key] > 0}.map{|row| row[:skill_group_name]}
      end

      def self.ordered_columns
        {
          student_name: [
            'Student Name',
            "" # Intentionally empty
          ],
          pre_questions_ratio: [
            'Pre: Questions Correct (Ratio)',
            "PLACEHOLDER"
          ],
          pre_questions_percentage: [
            'Pre: Questions Correct (Percentage)',
            "PLACEHOLDER"
          ],
          pre_skills_proficient_ratio: [
            'Pre: Skills Proficient (Ratio)',
            "PLACEHOLDER"
          ],
          pre_skills_proficient_list: [
            'Pre: Skills Proficient (List)',
            "PLACEHOLDER"
          ],
          pre_skills_to_practice_list: [
            'Pre: Skills to Practice (List)',
            "PLACEHOLDER"
          ],
          completed_activities: [
            'Total Activities',
            "PLACEHOLDER"
          ],
          time_spent_seconds: [
            'Total Time Spent',
            "PLACEHOLDER"
          ],
          post_questions_ratio: [
            'Post: Questions Correct (Ratio)',
            "PLACEHOLDER"
          ],
          post_questions_percentage: [
            'Post: Questions Correct (Percentage)',
            "PLACEHOLDER"
          ],
          post_skills_improved_or_maintained_ratio: [
            'Post: Skills Improved or Maintained (Ratio)',
            "PLACEHOLDER"
          ],
          post_skills_improved: [
            'Post: Skills Improved (Count)',
            "PLACEHOLDER"
          ],
          post_skills_maintained: [
            'Post: Skills Maintained (Count)',
            "PLACEHOLDER"
          ],
          post_skills_improved_list: [
            'Post: Skills Improved (List)',
            "PLACEHOLDER"
          ],
          post_skills_maintained_list: [
            'Post: Skills Maintained (List)',
            "PLACEHOLDER"
          ],
          post_skills_to_practice_list: [
            'Post: Skills with No Growth (List)',
            "PLACEHOLDER"
          ]
        }
      end

      def self.format_lambdas
        {
          pre_questions_ratio: format_as_ratio,
          pre_skills_proficient_ratio: format_as_ratio,
          pre_questions_percentage: format_percent_as_integer,
          pre_skills_proficient_list: format_as_list,
          pre_skills_to_practice_list: format_as_list,
          post_questions_ratio: format_as_ratio,
          post_skills_improved_or_maintained_ratio: format_as_ratio,
          post_questions_percentage: format_percent_as_integer,
          post_skills_improved_list: format_as_list,
          post_skills_maintained_list: format_as_list,
          post_skills_to_practice_list: format_as_list,
          time_spent_seconds: format_as_minutes_string
        }
      end

      def self.format_as_list = ->(x) { x.join(', ') }
      def self.format_as_ratio = ->(x) { x.join(' of ') }
      def self.format_as_minutes_string = ->(x) { x.present? ? "#{x.round / 60}:#{(x.round % 60).to_s.rjust(2, "0")}" : format_blank_as_zero.call(x) }
      def self.format_percent_as_integer = ->(x) { x.present? ? format_as_rounded_integer.call(x * 100) : format_blank_as_zero.call(x) }
      def self.format_blank_as_zero = ->(x) { x.blank? ? 0 : x }
    end
  end
end
