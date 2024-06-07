# frozen_string_literal: true

module Adapters
  module Csv
    class AdminDiagnosticStudentsSummaryDataExport < CsvDataExport
      ORDERED_COLUMNS =  {
        student_name: {
          csv_header: 'Student Name',
          csv_tooltip: "", # Intentionally empty
          formatter: Formatter::DEFAULT
        },
        pre_questions_ratio: {
          csv_header: 'Pre: Questions Correct (Ratio)',
          csv_tooltip: "The ratio of questions the student answered correctly on the Pre diagnostic.",
          formatter: Formatter::AS_RATIO
        },
        pre_questions_percentage: {
          csv_header: 'Pre: Questions Correct (Percentage)',
          csv_tooltip: "The percentage of questions the student answered correctly on the Pre diagnostic.",
          formatter: Formatter::PERCENT_AS_INTEGER
        },
        pre_skills_proficient_ratio: {
          csv_header: 'Pre: Skills Proficient (Ratio)',
          csv_tooltip: "The ratio of skills the student demonstrated proficiency in on the Pre diagnostic.",
          formatter: Formatter::AS_RATIO
        },
        pre_skills_proficient_list: {
          csv_header: 'Pre: Skills Proficient (List)',
          csv_tooltip: "A list of skills the student demonstrated proficiency in on the Pre diagnostic.",
          formatter: Formatter::AS_LIST
        },
        pre_skills_to_practice_list: {
          csv_header: 'Pre: Skills to Practice (List)',
          csv_tooltip: "A list of skills the student did not demonstrate proficiency in on the Pre diagnostic.",
          formatter: Formatter::AS_LIST
        },
        completed_activities: {
          csv_header: 'Total Activities',
          csv_tooltip: "The total number of activities the student completed that are linked to this particular diagnostic.",
          formatter: Formatter::DEFAULT
        },
        time_spent_seconds: {
          csv_header: 'Total Time Spent',
          csv_tooltip: "The total time spent by the student on activities that are linked to this particular diagnostic.",
          formatter: Formatter::AS_MINUTES_STRING
        },
        post_questions_ratio: {
          csv_header: 'Post: Questions Correct (Ratio)',
          csv_tooltip: "The ratio of questions the student answered correctly on the Post diagnostic.",
          formatter: Formatter::AS_RATIO
        },
        post_questions_percentage: {
          csv_header: 'Post: Questions Correct (Percentage)',
          csv_tooltip: "The percentage of questions the student answered correctly on the Post diagnostic.",
          formatter: Formatter::PERCENT_AS_INTEGER
        },
        post_skills_improved_or_maintained_ratio: {
          csv_header: 'Post: Skills Improved or Maintained (Ratio)',
          csv_tooltip: "The ratio of skills the student improved or maintained proficiency in on the Post diagnostic.",
          formatter: Formatter::AS_RATIO
        },
        post_skills_improved: {
          csv_header: 'Post: Skills Improved (Count)',
          csv_tooltip: "The number of skills the student improved proficiency in on the Post diagnostic.",
          formatter: Formatter::DEFAULT
        },
        post_skills_maintained: {
          csv_header: 'Post: Skills Maintained (Count)',
          csv_tooltip: "The number of skills the student maintained proficiency in on the Post diagnostic.",
          formatter: Formatter::DEFAULT
        },
        post_skills_improved_list: {
          csv_header: 'Post: Skills Improved (List)',
          csv_tooltip: "A list of skills the student improved on the Post diagnostic.",
          formatter: Formatter::AS_LIST
        },
        post_skills_maintained_list: {
          csv_header: 'Post: Skills Maintained (List)',
          csv_tooltip: "A list of skills the student maintained proficiency in on the Post diagnostic.",
          formatter: Formatter::AS_LIST
        },
        post_skills_to_practice_list: {
          csv_header: 'Post: Skills with No Growth (List)',
          csv_tooltip: "A list of skills the student demonstrated no growth in on the Post diagnostic.",
          formatter: Formatter::AS_LIST
        }
      }.freeze

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

      def self.ordered_columns = ORDERED_COLUMNS
    end
  end
end
