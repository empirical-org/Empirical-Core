# frozen_string_literal: true

# rubocop:disable Layout/HashAlignment

require 'csv'

module Snapshots
  class PremiumDataCsvGenerator < ::CsvGenerator
    ORDERED_COLUMNS = {
      student_name:     { csv_header: 'Student Name', formatter: Formatter::DEFAULT },
      student_email:    { csv_header: 'Student Email', formatter: Formatter::DEFAULT },
      completed_at:     { csv_header: 'Completed Date', formatter: Formatter::DATE },
      activity_name:    { csv_header: 'Activity', formatter: Formatter::DEFAULT },
      activity_pack:    { csv_header: 'Activity Pack', formatter: Formatter::DEFAULT },
      score:            { csv_header: 'Score', formatter: Formatter::SCORE_OR_COMPLETED },
      timespent:        { csv_header: 'Time Spent (Mins)', formatter: Formatter::SECONDS_TO_MINUTES },
      standard:         { csv_header: 'Standard', formatter: Formatter::DEFAULT },
      tool:             { csv_header: 'Tool', formatter: Formatter::DEFAULT },
      school_name:      { csv_header: 'School', formatter: Formatter::DEFAULT },
      classroom_grade:  { csv_header: 'Grade', formatter: Formatter::DEFAULT },
      teacher_name:     { csv_header: 'Teacher', formatter: Formatter::DEFAULT },
      classroom_name:   { csv_header: 'Class', formatter: Formatter::DEFAULT }
    }.freeze

    def ordered_columns = ORDERED_COLUMNS
  end
end

# rubocop:enable Layout/HashAlignment
