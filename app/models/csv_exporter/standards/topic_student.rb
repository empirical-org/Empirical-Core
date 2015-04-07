module CsvExporter::Standards
  class TopicStudent
    def header_row
      [
        'Student Name',
        'Activities',
        'Average',
        'Mastery Status'
      ]
    end

    def data_row(record)
      json_hash = ProgressReports::Standards::StudentSerializer.new(record).as_json(root: false)
      [
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
  end
end