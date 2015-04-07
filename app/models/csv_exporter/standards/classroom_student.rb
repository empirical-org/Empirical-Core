module CsvExporter
  module Standards
    class ClassroomStudent
      def header_row
        [
          'Student',
          'Standards',
          'Proficient Standards',
          'Near Proficiency Standards',
          'Not Proficient Standards',
          'Activities',
          'Average',
          'Overall Mastery Status'
        ]
      end

      def data_row(record)
        json_hash = ProgressReports::Standards::StudentSerializer.new(record).as_json(root: false)
        [
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
          teacher,
          HashWithIndifferentAccess.new(filters) || {})
      end
    end
  end
end