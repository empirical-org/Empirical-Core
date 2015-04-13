require 'rails_helper'

describe CsvExporter::Standards::ClassroomTopic do
  include_context 'Topic Progress Report'
  it_behaves_like 'CSV Exporter' do
    let(:expected_header_row) {
      [
        'Page Title',
        'Standard Level',
        'Standard Name',
        'Students',
        'Proficient Students',
        'Nearly Proficient Students',
        'Not Proficient Students',
        'Activities'
      ]
    }

    let(:filters) { { classroom_id: full_classroom.id } }

    let(:model_instance) {
      Topic.for_standards_report(teacher, {}).first
    }

    let(:expected_data_row) {
      [
        "Standards by Class: #{full_classroom.name}",
        model_instance.section_name,
        model_instance.name,
        model_instance.total_student_count,
        model_instance.proficient_student_count,
        model_instance.near_proficient_student_count,
        model_instance.not_proficient_student_count,
        model_instance.total_activity_count
      ]
    }

    let(:expected_model_data_size) {
      visible_topics.size
    }
  end
end