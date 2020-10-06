require 'rails_helper'

describe CsvExporter::Standards::StandardStudent do
  include_context 'Standard Progress Report'
  it_behaves_like 'CSV Exporter' do
    let(:expected_header_row) {
      [
        'Page Title',
        'Student Name',
        'Activities',
        'Average',
        'Mastery Status'
      ]
    }

    let(:filters) { { standard_id: first_grade_standard.id } }

    let(:model_instance) {
      ProgressReports::Standards::Student.new(teacher).results({}).first
    }

    let(:expected_data_row) {
      [
        "Standards: #{first_grade_standard.name}",
        model_instance.name,
        model_instance.total_activity_count,
        model_instance.average_score,
        'Proficient'
      ]
    }

    let(:expected_model_data_size) {
      first_grade_standard_students.size
    }
  end
end
