require 'rails_helper'

describe CsvExporter::Standards::StudentTopic do
  include_context 'Topic Progress Report'
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
      ProgressReports::Standards::Topic.new(teacher).results({}).first
    }

    let(:filters) { { student_id: alice.id } }

    let(:expected_data_row) {
      [
        "Standards: #{alice.name}",
        model_instance.section_name,
        model_instance.name,
        model_instance.total_activity_count,
        'Not Yet Proficient'
      ]
    }

    let(:expected_model_data_size) {
      visible_topics.size
    }
  end
end
