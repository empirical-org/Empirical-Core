require 'rails_helper'

describe CsvExporter::Standards::ClassroomTopic do
  include_context 'Topic Progress Report'
  it_behaves_like 'CSV Exporter' do
    let(:expected_header_row) {
      [
        'Standard Level',
        'Standard Name',
        'Students',
        'Proficient Students',
        'Near Proficiency Students',
        'Not Proficient Students',
        'Activities'
      ]
    }

    let(:model_instance) {
      Topic.for_standards_report(teacher, {}).first
    }

    let(:expected_data_row) {
      [
        model_instance.section_name,
        model_instance.name,
        model_instance.total_student_count,
        model_instance.proficient_student_count,
        model_instance.near_proficient_student_count,
        model_instance.not_proficient_student_count,
        model_instance.total_activity_count
      ]
    }

    let(:model_data_subject) {
      csv_exporter.model_data(teacher, {})
    }

    let(:expected_model_data_size) {
      visible_topics.size
    }
  end
end