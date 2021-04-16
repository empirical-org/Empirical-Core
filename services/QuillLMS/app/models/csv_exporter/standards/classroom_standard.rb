module CsvExporter::Standards
  class ClassroomStandard
    def header_row
      [
        'Page Title',
        'Standard Level',
        'Standard Name',
        'Students',
        'Proficient Students',
        'Not Yet Proficient Students',
        'Activities'
      ]
    end

    def data_row(record, filters)
      json_hash = ProgressReports::Standards::StandardSerializer.new(record).as_json(root: false)
      [
        page_title(filters),
        json_hash[:standard_level_name],
        json_hash[:name],
        json_hash[:total_student_count],
        json_hash[:proficient_student_count],
        json_hash[:not_proficient_student_count],
        json_hash[:total_activity_count]
      ]
    end

    def model_data(teacher, filters)
      ::ProgressReports::Standards::Standard.new(teacher)
        .results(HashWithIndifferentAccess.new(filters) || {})
    end

    private def page_title(filters)
      classroom = ::Classroom.find(filters[:classroom_id])
      "Standards by Class: #{classroom.name}"
    end
  end
end
