require 'rails_helper'

describe CsvExporter::Standards::ClassroomStudent do
  include_context 'Topic Progress Report'
  it_behaves_like 'CSV Exporter' do
    let(:expected_header_row) do
      [
        'Page Title',
        'Student',
        'Standards',
        'Proficient Standards',
        'Nearly Proficient Standards',
        'Not Proficient Standards',
        'Activities',
        'Average',
        'Overall Mastery Status'
      ]
    end

    let(:filters) { { classroom_id: full_classroom.id } }

    let(:model_instance) do
      ProgressReports::Standards::Student.new(teacher).results({}).first
    end

    let(:expected_data_row) do
      [
        "Standards by Student: #{full_classroom.name}",
        model_instance.name,
        model_instance.total_standard_count,
        model_instance.proficient_standard_count,
        model_instance.near_proficient_standard_count,
        model_instance.not_proficient_standard_count,
        model_instance.total_activity_count,
        model_instance.average_score,
        'Proficient'
      ]
    end

    let(:expected_model_data_size) do
      visible_students.size
    end
  end
end
