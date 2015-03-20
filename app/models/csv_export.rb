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
    csv << csv_exporter.header_row
    csv_exporter.model_data(teacher, filters).find_each do |record|
      csv << csv_exporter.data_row(record)
    end
    file
  end

  def mark_sent!
    self.emailed_at = Time.now
    save!
  end

  private

  def csv_exporter
    @exporter ||=
      case export_type.to_sym
      when :activity_sessions
        CsvExporter::ActivitySession.new
      else
        raise "Export type named #{export_type} could not be found!"
      end
  end

  def csv_basename
    "csv_#{teacher_id}_#{export_type}"
  end
end
