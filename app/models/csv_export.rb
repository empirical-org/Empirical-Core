require 'csv'

class CsvExport < ActiveRecord::Base
  EXPORT_TYPE_OPTIONS = %w(activity_sessions)

  belongs_to :teacher, class_name: 'User'

  mount_uploader :csv_file, CsvUploader

  validates :export_type, inclusion: {:in => EXPORT_TYPE_OPTIONS}

  def sent?
    emailed_at.present?
  end

  def export!
    return if sent?
    begin
      file = generate_csv
      csv_file.store!(file)
      save!
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

  def mark_sent!
    self.emailed_at = Time.now
    save!
  end

  def model_data
    case export_type.to_sym
    when :activity_sessions
      ActivitySession.for_standalone_progress_report(teacher, HashWithIndifferentAccess.new(filters) || {})
    end
  end

  private

  def csv_row(record)
    case export_type.to_sym
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
    else
      raise "Export type named #{export_type} could not be found!"
    end
  end

  def csv_header
    case export_type.to_sym
    when :activity_sessions
      ['app', 'activity', 'date', 'time_spent', 'standard', 'score', 'student']
    else
      raise "Export type named #{export_type} could not be found!"
    end
  end

  def csv_basename
    "csv_#{teacher_id}_#{export_type}"
  end
end
