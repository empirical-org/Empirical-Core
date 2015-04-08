module CsvExporter::Standards
  class StudentTopic
    def header_row
      [
        'Page Title',
        'Standard Level',
        'Standard Name',
        'Activities',
        'Average Mastery Status'
      ]
    end

    def data_row(record, filters)
      json_hash = ProgressReports::Standards::TopicSerializer.new(record).as_json(root: false)
      [
        page_title(filters),
        json_hash[:section_name],
        json_hash[:name],
        json_hash[:total_activity_count],
        json_hash[:mastery_status]
      ]
    end

    def model_data(teacher, filters)
      ::Topic.for_standards_report(
        teacher,
        HashWithIndifferentAccess.new(filters) || {})
    end

    private

    def page_title(filters)
      student = ::User.find(filters[:student_id])
      "Standards: #{student.name}"
    end
  end
end