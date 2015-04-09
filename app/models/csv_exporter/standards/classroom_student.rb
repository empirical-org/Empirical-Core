module CsvExporter
  module Standards
    class ClassroomStudent
      def header_row
        [
          'Page Title',
          'Student',
          'Standards',
          'Proficient Standards',
          'Nearly Proficient Standards',
          'Not Proficient Standards',
          'Activities',
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
          json_hash[:near_proficient_standard_count],
          json_hash[:not_proficient_standard_count],
          json_hash[:total_activity_count],
          json_hash[:average_score],
          json_hash[:mastery_status]
        ]
      end

      def model_data(teacher, filters)
        ::User.for_standards_report(
          teacher, filters)
      end

      private

      def page_title(filters)
        classroom = ::Classroom.find(filters[:classroom_id])
        "Standards by Student: #{classroom.name}"
      end
    end
  end
end