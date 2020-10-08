module CsvExporter
  class ActivitySession
    PAGE_TITLE = 'Data Export'

    def header_row
      # Student, Date, Activity, Score, Standard, App
      [
        'Page Title',
        'Student',
        'Date',
        'Activity',
        'Score',
        'Standard Level',
        'Standard',
        'App'
      ]
    end

    def data_row(record, filters)
      json_hash = ProgressReports::ActivitySessionSerializer.new(record).as_json(root: false)
      # Student, Date, Activity, Score, Standard, App
      [
        PAGE_TITLE,
        json_hash[:student_name],
        json_hash[:display_completed_at],
        json_hash[:activity_name],
        json_hash[:percentage],
        record.activity.try(:standard_level).try(:name),
        record.activity.try(:standard).try(:name),
        json_hash[:activity_classification_name]
      ]
    end

    def model_data(teacher, filters)
      ::ProgressReports::ActivitySession.new(teacher)
        .results(HashWithIndifferentAccess.new(filters) || {})
    end
  end
end
