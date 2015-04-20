module CsvExporter::Standards
  class ClassroomTopic
    def header_row
      [
        'Page Title',
        'Standard Level',
        'Standard Name',
        'Students',
        'Proficient Students',
        'Nearly Proficient Students',
        'Not Proficient Students',
        'Activities'
      ]
    end

    def data_row(record, filters)
      json_hash = ProgressReports::Standards::TopicSerializer.new(record).as_json(root: false)
      [
        page_title(filters),
        json_hash[:section_name],
        json_hash[:name],
        json_hash[:total_student_count],
        json_hash[:proficient_student_count],
        json_hash[:near_proficient_student_count],
        json_hash[:not_proficient_student_count],
        json_hash[:total_activity_count]
      ]
    end

    def model_data(teacher, filters)
      ::Topic.for_standards_report(
        teacher,
        HashWithIndifferentAccess.new(filters) || {})
    end

    private

    def page_title(filters)
      classroom = ::Classroom.find(filters[:classroom_id])
      "Standards by Class: #{classroom.name}"
    end
  end
end