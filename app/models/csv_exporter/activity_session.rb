module CsvExporter
  class ActivitySession
    def header_row
      ['app', 'activity', 'date', 'time_spent', 'standard', 'score', 'student']
    end

    def data_row(record)
      json_hash = ProgressReports::ActivitySessionSerializer.new(record).as_json(root: false)
      [
        json_hash[:activity_classification_name],
        json_hash[:activity_name],
        json_hash[:display_completed_at],
        json_hash[:time_spent],
        json_hash[:standard],
        json_hash[:percentage],
        json_hash[:student_name]
      ]
    end

    def model_data(teacher, filters)
      ::ActivitySession.for_standalone_progress_report(
        teacher,
        HashWithIndifferentAccess.new(filters) || {})
    end
  end
end