# frozen_string_literal: true

module CsvExporter::Standards
  class StudentStandard
    def header_row
      [
        'Page Title',
        'Standard Level',
        'Standard Name',
        'Activities',
        'Time Spent',
        'Average Mastery Status'
      ]
    end

    def data_row(record, filters)
      json_hash = ProgressReports::Standards::StandardSerializer.new(record).as_json(root: false)
      [
        page_title(filters),
        json_hash[:standard_level_name],
        json_hash[:name],
        json_hash[:total_activity_count],
        json_hash[:timespent],
        json_hash[:mastery_status]
      ]
    end

    def model_data(teacher, filters)
      ::ProgressReports::Standards::Standard.new(teacher)
        .results(ActiveSupport::HashWithIndifferentAccess.new(filters) || {})
    end

    private def page_title(filters)
      student = ::User.find(filters[:student_id])
      "Standards: #{student.name}"
    end
  end
end
