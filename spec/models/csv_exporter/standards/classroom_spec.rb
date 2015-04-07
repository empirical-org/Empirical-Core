require 'rails_helper'

describe CsvExporter::Standards::Classroom do
  include_context 'Topic Progress Report'
  it_behaves_like 'CSV Exporter' do
    let(:expected_header_row) {
      ['Class Name', 'Students', 'Proficient', 'Near Proficiency', 'Not Proficient', 'Standards']
    }

    let(:model_instance) {
      Classroom.for_standards_report(teacher, {}).where(id: full_classroom.id).first
    }

    let(:expected_data_row) {
      [
        full_classroom.name,
        visible_students.size,
        proficient_students.size,
        near_proficient_students.size,
        not_proficient_students.size,
        visible_topics.size
      ]
    }

    let(:model_data_subject) {
      csv_exporter.model_data(teacher, {})
    }

    let(:expected_model_data_size) {
      visible_classrooms.size
    }
  end
end