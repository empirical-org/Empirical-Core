module CsvExporter::Standards
  class TopicStudent
    def header_row
      [
        'Page Title',
        'Student Name',
        'Activities',
        'Average',
        'Mastery Status'
      ]
    end

    def data_row(record, filters)
      json_hash = ProgressReports::Standards::StudentSerializer.new(record).as_json(root: false)
      [
        page_title(filters),
        json_hash[:name],
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

    private

    def page_title(filters)
      topic = ::Topic.find(filters[:topic_id])
      "Standards: #{topic.name}"
    end
  end
end