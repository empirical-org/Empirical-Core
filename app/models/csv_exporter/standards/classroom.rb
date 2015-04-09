module CsvExporter::Standards
  class Classroom
    PAGE_TITLE = 'Standards: All Classrooms'

    def header_row
      [
        'Page Title',
        'Class Name',
        'Students',
        'Proficient Students',
        'Nearly Proficient Students',
        'Not Proficient Students',
        'Standards'
      ]
    end

    def data_row(record, filters)
      json_hash = ProgressReports::Standards::ClassroomSerializer.new(record).as_json(root: false)
      [
        PAGE_TITLE,
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