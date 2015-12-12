require 'rails_helper'

describe CsvExporter::Standards::Classroom do
  include_context 'Topic Progress Report'
  it_behaves_like 'CSV Exporter' do
    let(:expected_header_row) do
      ['Page Title', 'Class Name', 'Students', 'Proficient Students', 'Nearly Proficient Students', 'Not Proficient Students', 'Standards']
    end

    let(:filters) { {} }

    let(:model_instance) do
      ProgressReports::Standards::Classroom.new(teacher).results(filters).where(id: full_classroom.id).first
    end

    let(:expected_data_row) do
      [
        CsvExporter::Standards::Classroom::PAGE_TITLE,
        full_classroom.name,
        visible_students.size,
        proficient_students.size,
        near_proficient_students.size,
        not_proficient_students.size,
        visible_topics.size
      ]
    end

    let(:expected_model_data_size) do
      visible_classrooms.size
    end
  end
end
