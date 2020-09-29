require 'rails_helper'

describe CsvExporter::Standards::StudentStandard do
  include_context 'Standard Progress Report'
  it_behaves_like 'CSV Exporter' do
    let(:expected_header_row) {
      [
        'Page Title',
        'Standard Level',
        'Standard Name',
        'Activities',
        'Average Mastery Status'
      ]
    }

    let(:model_instance) {
      ProgressReports::Standards::Standard.new(teacher).results({}).first
    }

    let(:filters) { { student_id: alice.id } }

    let(:expected_data_row) {
      [
        "Standards: #{alice.name}",
        model_instance.standard_level_name,
        model_instance.name,
        model_instance.total_activity_count,
        'Not yet proficient'
      ]
    }

    let(:expected_model_data_size) {
      visible_standards.size
    }
  end
end
