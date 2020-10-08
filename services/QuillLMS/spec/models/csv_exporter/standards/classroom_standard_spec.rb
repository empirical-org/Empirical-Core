require 'rails_helper'

describe CsvExporter::Standards::ClassroomStandard do
  include_context 'Standard Progress Report'
  it_behaves_like 'CSV Exporter' do
    let(:expected_header_row) {
      [
        'Page Title',
        'Standard Level',
        'Standard Name',
        'Students',
        'Proficient Students',
        'Not Yet Proficient Students',
        'Activities'
      ]
    }

    let(:filters) { { classroom_id: full_classroom.id } }

    let(:model_instance) {
      ProgressReports::Standards::Standard.new(teacher).results({}).first
    }

    let(:expected_data_row) {
      [
        "Standards by Class: #{full_classroom.name}",
        model_instance.standard_level_name,
        model_instance.name,
        model_instance.total_student_count,
        model_instance.proficient_student_count,
        model_instance.not_proficient_student_count,
        model_instance.total_activity_count
      ]
    }

    let(:expected_model_data_size) {
      visible_standards.size
    }
  end
end
