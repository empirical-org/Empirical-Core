# frozen_string_literal: true

require 'csv'

module Adapters
  module Csv
    class AdminDiagnosticOverviewDataExport < CsvDataExport
      class UnhandledColumnError < StandardError; end
      class BigQueryResultMissingRequestedColumnError < StandardError; end

      def self.ordered_columns
        {
          diagnostic_name: [
            'Diagnostic Name',
            '' # Intentionally blank
          ],
          pre_students_assigned: [
            'Students Assigned Pre Diagnostic',
            "The total number of students assigned the Pre diagnostic."
          ],
          pre_students_completed: [
            'Students Who Completed Pre Diagnostic',
            "The total number of students who completed the Pre diagnostic."
          ],
          students_completed_practice: [
            'Completed Activities',
            "The total number of students who have completed the practice activities linked to this diagnostic.\n\nA student is counted once the student has completed at least one practice activity linked to this diagnostic."
          ],
          average_practice_activities_count: [
            'Average Activities',
            "Each diagnostic is linked to recommended practice activities. For the students who have completed activities, this shows the average number of completed activities  per student.\n\nThis counts the practice activities connected to this particular diagnostic - not the total number of activities that the student has practiced on Quill."
          ],
          average_time_spent_seconds: [
            'Average Time Spent',
            "Each diagnostic is linked to recommended practice activities. For the students who have completed activities, this shows the average time spent per student in minutes.\n\nThis counts the practice activities connected to this particular diagnostic - not the total number of activities that the student has practiced on Quill."
          ],
          post_students_assigned: [
            'Students Assigned Post Diagnostic',
            "The total number of students assigned the Post diagnostic."
          ],
          post_students_completed: [
            'Students Who Completed Post Diagnostic',
            "The total number of students who completed the Post diagnostic."
          ],
          overall_skill_growth: [
            'Overall Skill Growth',
            "The average increase in growth scores across all of the skills.\n\nThe Performance by Skill report shows the average increase in questions answered correctly for each skill, and the overall growth is the average increase across all skills.\n\nThe growth score is based on only the students who have completed both the Pre and Post diagnostic. The growth score does not include students who only did the Pre."
          ]
        }
      end

      def self.format_lambdas
        {
          average_practice_activities_count: format_as_rounded_integer,
          average_time_spent_seconds: format_as_minutes_string,
          diagnostic_name: format_all_caps,
          overall_skill_growth: format_percent_as_integer,
          pre_students_assigned: format_blank_as_zero,
          pre_students_completed: format_blank_as_zero,
          post_students_assigned: format_blank_as_zero,
          post_students_completed: format_blank_as_zero,
          students_completed_practice: format_blank_as_zero
        }
      end

      def self.format_all_caps = ->(x) { x.upcase }
      def self.format_as_minutes_string = ->(x) { x.present? ? "#{x.round / 60}:#{(x.round % 60).to_s.rjust(2, '0')}" : format_blank_as_zero.call(x) }
      def self.format_percent_as_integer = ->(x) { x.present? ? format_as_rounded_integer.call(x * 100) : format_blank_as_zero.call(x) }
      def self.format_as_rounded_integer = ->(x) { x.present? ? x.round : format_blank_as_zero.call(x) }
      def self.format_blank_as_zero = ->(x) { x.presence || 0 }
    end
  end
end
