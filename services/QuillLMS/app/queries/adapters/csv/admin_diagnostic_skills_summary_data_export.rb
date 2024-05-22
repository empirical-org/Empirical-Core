# frozen_string_literal: true

require 'csv'

module Adapters
  module Csv
    class AdminDiagnosticSkillsSummaryDataExport < CsvDataExport
      class UnhandledColumnError < StandardError; end
      class BigQueryResultMissingRequestedColumnError < StandardError; end

      def self.ordered_columns
        {
          skill_group_name: [
            'Skill',
            '' # Intentionally blank
          ],
          pre_score: [
            'Pre Skill Score',
            "The averaged number of questions answered correctly for this skill on the Pre diagnostic.\n\nThis is the average score for all of the students selected in the filters."
          ],
          post_score: [
            'Post Skill Score',
            "The averaged number of questions answered correctly for this skill on the Post diagnostic.\n\nThis is the average score for all of the students selected in the filters."
          ],
          growth_percentage: [
            'Growth Results',
            "The increase in the averaged number of questions answered correctly for this skill from the Pre to the Post diagnostic.\n\nThis is the average increase for all of the students selected in the filters.\n\nThe growth score is based on only the students who have completed both the Pre and Post diagnostic. The growth score does not include students who only did the Pre."
          ],
          post_students_completed: [
            'Students Who Completed Pre and Post Diagnostic',

          ],
          improved_proficiency: [
            'Students Improved Skill',
            "The number of students who improved in the skill by answering more questions correctly on the Post diagnostic than they did on the Pre. This includes students who gained Some Proficiency and Gained Full Proficiency in this skill.\n\nThis total count(”of __ students”) includes all students who completed both the Pre and the Post diagnostic and are selected in the filters."
          ],
          recommended_practice: [
            'Students Without Improvement',
            "The total number of students who did not show improvement in this skill by not answering more questions correctly in the Post than the Pre (and who were not already proficient). Quill provides a recommended activity pack for each skill so that educators can easily assign practice activities so that students can practice this skill.\n\nThis total count(”of __ students”) includes all students who completed both the Pre and the Post diagnostic and are selected in the filters."
          ],
          maintained_proficiency: [
            'Students Maintained Proficiency',
            "The total number of students who answered all questions for this skill correctly on both the Pre and the Post diagnostic.\n\nThis total count(”of __ students”) includes all students who completed both the Pre and the Post diagnostic and are selected in the filters."
          ]
        }
      end

      def self.format_lambdas
        {
          pre_score: format_percent_as_ingeger,
          post_score: format_percent_as_ingeger,
          growth_percentage: format_percent_as_ingeger
        }
      end

      def self.format_percent_as_integer = ->(x) { x.present? ? format_as_rounded_integer.call(x * 100) : format_blank_as_zero.call(x) }
      def self.format_blank_as_zero = ->(x) { x.blank? ? 0 : x }
    end
  end
end
