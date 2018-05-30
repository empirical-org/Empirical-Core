module CsvExporter::Standards
  class Classroom
    PAGE_TITLE = 'Standards: All Classrooms'

    def header_row
      [
        'Page Title',
        'Class Name',
        'Students',
        'Proficient Students',
        'Not Yet Proficient Students',
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
        json_hash[:not_proficient_student_count],
        json_hash[:total_standard_count],
      ]
    end

    def model_data(teacher, filters)
      ::ProgressReports::Standards::Classroom.new(teacher)
        .results(HashWithIndifferentAccess.new(filters) || {})
    end
  end
end
