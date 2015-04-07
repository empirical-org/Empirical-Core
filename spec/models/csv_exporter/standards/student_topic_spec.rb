require 'rails_helper'

describe CsvExporter::Standards::StudentTopic do
  include_context 'Topic Progress Report'
  it_behaves_like 'CSV Exporter' do
    let(:expected_header_row) {
      [
        'Standard Level',
        'Standard Name',
        'Activities',
        'Average Mastery Status'
      ]
    }

    let(:model_instance) {
      Topic.for_standards_report(teacher, {}).first
    }

    let(:expected_data_row) {
      [
        model_instance.section_name,
        model_instance.name,
        model_instance.total_activity_count,
        'Near Proficient'
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