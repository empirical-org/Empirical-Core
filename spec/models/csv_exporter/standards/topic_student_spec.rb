require 'rails_helper'

describe CsvExporter::Standards::TopicStudent do
  include_context 'Topic Progress Report'
  it_behaves_like 'CSV Exporter' do
    let(:expected_header_row) do
      [
        'Page Title',
        'Student Name',
        'Activities',
        'Average',
        'Mastery Status'
      ]
    end

    let(:filters) { { topic_id: first_grade_topic.id } }

    let(:model_instance) do
      ProgressReports::Standards::Student.new(teacher).results({}).first
    end

    let(:expected_data_row) do
      [
        "Standards: #{first_grade_topic.name}",
        model_instance.name,
        model_instance.total_activity_count,
        model_instance.average_score,
        'Proficient'
      ]
    end

    let(:expected_model_data_size) do
      first_grade_topic_students.size
    end
  end
end
