# frozen_string_literal: true

# == Schema Information
#
# Table name: csv_exports
#
#  id          :integer          not null, primary key
#  csv_file    :string
#  emailed_at  :datetime
#  export_type :string
#  filters     :json
#  created_at  :datetime
#  updated_at  :datetime
#  teacher_id  :integer
#
require 'csv'

class CsvExport < ApplicationRecord
  EXPORT_TYPE_OPTIONS = %w(activity_sessions
                           standards_classrooms
                           standards_classroom_students
                           standards_classroom_standards
                           standards_student_standards
                           standards_standard_students)

  belongs_to :teacher, class_name: 'User'

  mount_uploader :csv_file, CsvUploader

  validates :export_type, inclusion: {in: EXPORT_TYPE_OPTIONS}

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
    data_filters = (filters || {}).with_indifferent_access
    csv_exporter.model_data(teacher, data_filters).each do |record|
      csv << csv_exporter.data_row(record, data_filters)
    end
    file
  end

  def mark_sent!
    self.emailed_at = Time.current
    save!
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  private def csv_exporter
    @exporter ||=
      case export_type.to_sym
      when :activity_sessions
        CsvExporter::ActivitySession.new
      when :standards_classrooms
        CsvExporter::Standards::Classroom.new
      when :standards_classroom_students
        CsvExporter::Standards::ClassroomStudent.new
      when :standards_classroom_standards
        CsvExporter::Standards::ClassroomStandard.new
      when :standards_standard_students
        CsvExporter::Standards::StandardStudent.new
      when :standards_student_standards
        CsvExporter::Standards::StudentStandard.new
      else
        raise "Export type named #{export_type} could not be found!"
      end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  private def csv_basename
    "csv_#{teacher_id}_#{export_type}"
  end
end
