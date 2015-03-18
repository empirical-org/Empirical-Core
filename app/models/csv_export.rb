require 'csv'

class CsvExport < ActiveRecord::Base
  EXPORT_TYPE_OPTIONS = %w(activity_sessions)

  belongs_to :teacher, class_name: 'User'

  mount_uploader :csv_file, CsvUploader

  validates :export_type, inclusion: {:in => EXPORT_TYPE_OPTIONS}

  def export
    return if emailed_at.present?
    begin
      file = generate_csv
      csv_file.store!(file)
    ensure
      file.close
      file.unlink
    end
  end

  def generate_csv
    file = Tempfile.open(csv_basename)
    csv = CSV.new(file)
    csv << csv_header
    model_data.find_each do |record|
      csv << csv_row(record)
    end
    file
  end

  def model_data
    case export_type
    when :activity_sessions
      ActivitySession.completed.by_teacher(teacher)
    end
  end

  private

  def csv_row(record)
    case export_type
    when :activity_sessions
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
  end

  def csv_header
    case export_type
    when :activity_sessions
      ['app', 'activity', 'date', 'time_spent', 'standard', 'score', 'student']
    end
  end

  def csv_basename
    "csv_#{teacher_id}_#{export_type}"
  end
end
