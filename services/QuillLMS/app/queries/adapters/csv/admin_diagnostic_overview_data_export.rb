# frozen_string_literal: true

module Adapters
  module Csv
    class AdminDiagnosticOverviewDataExport < CsvDataExport
      def self.ordered_columns
        {
          diagnostic_name: {
            csv_header: 'Diagnostic Name',
            csv_tooltip:'', # Intentionally blank
            formatter: Formatter::ALL_CAPS
          },
          pre_students_assigned: {
            csv_header: 'Students Assigned Pre Diagnostic',
            csv_tooltip: "The total number of students assigned the Pre diagnostic.",
            formatter: Formatter::BLANK_AS_ZERO
          },
          pre_students_completed: {
            csv_header: 'Students Who Completed Pre Diagnostic',
            csv_tooltip: "The total number of students who completed the Pre diagnostic.",
            formatter: Formatter::BLANK_AS_ZERO
          },
          students_completed_practice: {
            csv_header: 'Completed Activities',
            csv_tooltip: "The total number of students who have completed the practice activities linked to this diagnostic.\n\nA student is counted once the student has completed at least one practice activity linked to this diagnostic.",
            formatter: Formatter::BLANK_AS_ZERO
          },
          average_practice_activities_count: {
            csv_header: 'Average Activities',
            csv_tooltip: "Each diagnostic is linked to recommended practice activities. For the students who have completed activities, this shows the average number of completed activities  per student.\n\nThis counts the practice activities connected to this particular diagnostic - not the total number of activities that the student has practiced on Quill.",
            formatter: Formatter::AS_ROUNDED_INTEGER
          },
          average_time_spent_seconds: {
            csv_header: 'Average Time Spent',
            csv_tooltip: "Each diagnostic is linked to recommended practice activities. For the students who have completed activities, this shows the average time spent per student in minutes.\n\nThis counts the practice activities connected to this particular diagnostic - not the total number of activities that the student has practiced on Quill.",
            formatter: Formatter::AS_MINUTES_STRING
          },
          post_students_assigned: {
            csv_header: 'Students Assigned Post Diagnostic',
            csv_tooltip: "The total number of students assigned the Post diagnostic.",
            formatter: Formatter::BLANK_AS_ZERO
          },
          post_students_completed: {
            csv_header: 'Students Who Completed Post Diagnostic',
            csv_tooltip: "The total number of students who completed the Post diagnostic.",
            formatter: Formatter::BLANK_AS_ZERO
          },
          overall_skill_growth: {
            csv_header: 'Overall Skill Growth',
            csv_tooltip: "The average increase in growth scores across all of the skills.\n\nThe Performance by Skill report shows the average increase in questions answered correctly for each skill, and the overall growth is the average increase across all skills.\n\nThe growth score is based on only the students who have completed both the Pre and Post diagnostic. The growth score does not include students who only did the Pre.",
            formatter: Formatter::PERCENT_AS_INTEGER
          }
        }
      end
    end
  end
end
