# frozen_string_literal: true

module CsvExporter
  module Standards
    class ClassroomStudent
      def header_row
        [
          'Page Title',
          'Student',
          'Standards',
          'Proficient Standards',
          'Not Yet Proficient Standards',
          'Activities',
          'Time Spent',
          'Average',
          'Overall Mastery Status'
        ]
      end

      def data_row(record, filters)
        json_hash = ProgressReports::Standards::StudentSerializer.new(record).as_json(root: false)
        [
          page_title(filters),
          json_hash[:name],
          json_hash[:total_standard_count],
          json_hash[:proficient_standard_count],
          json_hash[:not_proficient_standard_count],
          json_hash[:total_activity_count],
          json_hash[:timespent],
          json_hash[:average_score],
          json_hash[:mastery_status]
        ]
      end

      def model_data(teacher, filters)
        ::ProgressReports::Standards::Student.new(teacher).results(filters)
      end

      private def page_title(filters)
        classroom = ::Classroom.find(filters[:classroom_id])
        "Standards by Student: #{classroom.name}"
      end
    end
  end
end
