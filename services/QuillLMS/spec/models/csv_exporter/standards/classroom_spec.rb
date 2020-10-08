require 'rails_helper'

describe CsvExporter::Standards::Classroom do
  include_context 'Standard Progress Report'
  # it_behaves_like 'CSV Exporter' do
  #   let(:expected_header_row) {
  #     ['Page Title', 'Class Name', 'Students', 'Proficient Students', 'Not Yet Proficient Students', 'Standards']
  #   }
  #
  #   let(:filters) { {} }
  #
  #   let(:model_instance) {
  #     ProgressReports::Standards::Classroom.new(teacher).results(filters).where(id: full_classroom.id).first
  #   }
  #
  #   let(:expected_data_row) {
  #     [
  #       CsvExporter::Standards::Classroom::PAGE_TITLE,
  #       full_classroom.name,
  #       visible_students.size,
  #       proficient_students.size,
  #       not_proficient_students.size,
  #       visible_standards.size
  #     ]
  #   }
  #
  #   let(:expected_model_data_size) {
  #     visible_classrooms.size
  #   }
  # end
end
