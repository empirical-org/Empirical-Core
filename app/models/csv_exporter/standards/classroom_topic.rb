module CsvExporter::Standards
  class ClassroomTopic
    def header_row
      [
        'Standard Level',
        'Standard Name',
        'Students',
        'Proficient Students',
        'Near Proficiency Students',
        'Not Proficient Students',
        'Activities'
      ]
    end

    def data_row(record)
      json_hash = ProgressReports::Standards::TopicSerializer.new(record).as_json(root: false)
      [
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
  end
end