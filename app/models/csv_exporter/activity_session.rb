module CsvExporter
  class ActivitySession
    def header_row
      ['Student', 'Activity', 'Score', 'Time Spent', 'Standard Level', 'Standard', 'App', 'Date']
    end

    def data_row(record)
      json_hash = ProgressReports::ActivitySessionSerializer.new(record).as_json(root: false)
      # Student -
      # Activity -
      # Score -
      # Time Spent -
      # Standard Level (Section) -
      # Standard (Topic) -
      # App -
      # Date
      [
        json_hash[:student_name],
        json_hash[:activity_name],
        json_hash[:percentage],
        json_hash[:time_spent],
        record.activity.try(:section).try(:name),
        record.activity.try(:topic).try(:name),
        json_hash[:activity_classification_name],
        json_hash[:display_completed_at]
      ]
    end

    def model_data(teacher, filters)
      ::ActivitySession.for_standalone_progress_report(
        teacher,
        HashWithIndifferentAccess.new(filters) || {})
    end
  end
end