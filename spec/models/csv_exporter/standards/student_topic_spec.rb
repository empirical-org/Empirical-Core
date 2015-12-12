require 'rails_helper'

describe CsvExporter::Standards::StudentTopic do
  include_context 'Topic Progress Report'
  it_behaves_like 'CSV Exporter' do
    let(:expected_header_row) do
      [
        'Page Title',
        'Standard Level',
        'Standard Name',
        'Activities',
        'Average Mastery Status'
      ]
    end

    let(:model_instance) do
      ProgressReports::Standards::Topic.new(teacher).results({}).first
    end

    let(:filters) { { student_id: alice.id } }

    let(:expected_data_row) do
      [
        "Standards: #{alice.name}",
        model_instance.section_name,
        model_instance.name,
        model_instance.total_activity_count,
        'Nearly Proficient'
      ]
    end

    let(:expected_model_data_size) do
      visible_topics.size
    end
  end
end
