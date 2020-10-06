module CsvExporter::Standards
  class StandardStudent
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
      ::ProgressReports::Standards::Student.new(teacher)
        .results(HashWithIndifferentAccess.new(filters) || {})
    end

    private

    def page_title(filters)
      standard = ::Standard.find(filters[:standard_id])
      "Standards: #{standard.name}"
    end
  end
end
