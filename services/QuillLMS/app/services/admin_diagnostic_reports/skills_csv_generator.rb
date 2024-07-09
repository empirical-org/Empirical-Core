# frozen_string_literal: true

module AdminDiagnosticReports
  class SkillsCsvGenerator < ::CsvGenerator
    ORDERED_COLUMNS = {
      skill_group_name: {
        csv_header: 'Skill',
        csv_tooltip: '', # Intentionally blank
        formatter: Formatter::ALL_CAPS
      },
      pre_score: {
        csv_header: 'Pre Skill Score',
        csv_tooltip: "The averaged number of questions answered correctly for this skill on the Pre diagnostic.\n\nThis is the average score for all of the students selected in the filters.",
        formatter: Formatter::PERCENT_AS_INTEGER
      },
      post_score: {
        csv_header: 'Post Skill Score',
        csv_tooltip: "The averaged number of questions answered correctly for this skill on the Post diagnostic.\n\nThis is the average score for all of the students selected in the filters.",
        formatter: Formatter::PERCENT_AS_INTEGER
      },
      growth_percentage: {
        csv_header: 'Growth Results',
        csv_tooltip: "The increase in the averaged number of questions answered correctly for this skill from the Pre to the Post diagnostic.\n\nThis is the average increase for all of the students selected in the filters.\n\nThe growth score is based on only the students who have completed both the Pre and Post diagnostic. The growth score does not include students who only did the Pre.",
        formatter: Formatter::PERCENT_AS_INTEGER
      },
      post_students_completed: {
        csv_header: 'Students Who Completed Pre and Post Diagnostic',
        csv_tooltip: 'The total number of students who completed the Pre and Post diagnostic.',
        formatter: Formatter::DEFAULT
      },
      improved_proficiency: {
        csv_header: 'Students Improved Skill',
        csv_tooltip: "The number of students who improved in the skill by answering more questions correctly on the Post diagnostic than they did on the Pre. This includes students who gained Some Proficiency and Gained Full Proficiency in this skill.\n\nThis total count(”of __ students”) includes all students who completed both the Pre and the Post diagnostic and are selected in the filters.",
        formatter: Formatter::DEFAULT
      },
      recommended_practice: {
        csv_header: 'Students Without Improvement',
        csv_tooltip: "The total number of students who did not show improvement in this skill by not answering more questions correctly in the Post than the Pre (and who were not already proficient). Quill provides a recommended activity pack for each skill so that educators can easily assign practice activities so that students can practice this skill.\n\nThis total count(”of __ students”) includes all students who completed both the Pre and the Post diagnostic and are selected in the filters.",
        formatter: Formatter::DEFAULT
      },
      maintained_proficiency: {
        csv_header: 'Students Maintained Proficiency',
        csv_tooltip: "The total number of students who answered all questions for this skill correctly on both the Pre and the Post diagnostic.\n\nThis total count(”of __ students”) includes all students who completed both the Pre and the Post diagnostic and are selected in the filters.",
        formatter: Formatter::DEFAULT
      }
    }.freeze

    def add_record_to_csv(csv, row)
      csv << sym_columns.map { |key| format_cell(key, row[key]) }
      # We want to expand each value in aggregate_rows into a separate row of the CSV
      row[:aggregate_rows]&.each do |agg_row|
        csv << aggregate_rows_sym_columns.map { |key| format_cell(key, agg_row[key]) }
      end
    end

    def ordered_columns = ORDERED_COLUMNS
    def aggregate_rows_sym_columns = sym_columns.map { |col| col == ordered_columns.keys.first ? :name : col }
  end
end
