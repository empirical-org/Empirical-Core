module CsvExporter
  class ActivitySession
    PAGE_TITLE = 'Activities: All Students'

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
        record.activity.try(:section).try(:name),
        record.activity.try(:topic).try(:name),
        json_hash[:activity_classification_name]
      ]
    end

    def model_data(teacher, filters)
      ::ActivitySession.for_standalone_progress_report(
        teacher,
        HashWithIndifferentAccess.new(filters) || {})
    end
  end
end