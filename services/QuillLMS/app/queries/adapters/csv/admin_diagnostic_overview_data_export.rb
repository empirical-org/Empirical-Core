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
            "PLACEHOLDER"
          ],
          pre_students_completed: [
            'Students Who Completed Pre Diagnostic',
            "PLACEHOLDER"
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
            "PLACEHOLDER"
          ],
          post_students_completed: [
            'Students Who Completed Post Diagnostic',
            "PLACEHOLDER"
          ],
          overall_skill_growth: [
            'Overall Skill Growth',
            "The average increase in growth scores across all of the skills.\n\nThe Performance by Skill report shows the average increase in questions answered correctly for each skill, and the overall growth is the average increase across all skills.\n\nThe growth score is based on only the students who have completed both the Pre and Post diagnostic. The growth score does not include students who only did the Pre."
          ]
        }
      end

      def self.format_lambdas
        {
          average_time_spent: format_as_minutes_string,
          overall_skill_growth: format_as_rounded_integer
        }
      end

      def self.format_as_minutes_string = ->(x) { x.present? ? "#{x.round / 60}:#{x.round % 60}" : x }
      def self.format_as_rounded_integer = ->(x) { x&.round }
    end
  end
end
