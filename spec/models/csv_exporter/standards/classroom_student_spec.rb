require 'rails_helper'

describe CsvExporter::Standards::ClassroomStudent do
  include_context 'Topic Progress Report'
  it_behaves_like 'CSV Exporter' do
    let(:expected_header_row) {
      [
        'Student',
        'Standards',
        'Proficient Standards',
        'Near Proficiency Standards',
        'Not Proficient Standards',
        'Activities',
        'Average',
        'Overall Mastery Status'
      ]
    }

    let(:model_instance) {
      User.for_standards_report(teacher, {}).first
    }

    let(:expected_data_row) {
      [
        model_instance.name,
        model_instance.total_standard_count,
        model_instance.proficient_standard_count,
        model_instance.near_proficient_standard_count,
        model_instance.not_proficient_standard_count,
        model_instance.total_activity_count,
        model_instance.average_score,
        'Proficient'
      ]
    }

    let(:model_data_subject) {
      csv_exporter.model_data(teacher, {})
    }

    let(:expected_model_data_size) {
      visible_students.size
    }
  end
end