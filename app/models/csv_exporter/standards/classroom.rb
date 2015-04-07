module CsvExporter::Standards
  class Classroom
    def header_row
      ['Class Name', 'Students', 'Proficient', 'Near Proficiency', 'Not Proficient', 'Standards']
    end

    def data_row(record)
      json_hash = ProgressReports::Standards::ClassroomSerializer.new(record).as_json(root: false)
      [
        json_hash[:name],
        json_hash[:total_student_count],
        json_hash[:proficient_student_count],
        json_hash[:near_proficient_student_count],
        json_hash[:not_proficient_student_count],
        json_hash[:total_standard_count],
      ]
    end

    def model_data(teacher, filters)
      ::Classroom.for_standards_report(
        teacher,
        HashWithIndifferentAccess.new(filters) || {})
    end
  end
end