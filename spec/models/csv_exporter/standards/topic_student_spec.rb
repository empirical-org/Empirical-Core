require 'rails_helper'

describe CsvExporter::Standards::TopicStudent do
  include_context 'Topic Progress Report'
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

    let(:filters) { { topic_id: first_grade_topic.id } }

    let(:model_instance) {
      User.for_standards_report(teacher, {}).first
    }

    let(:expected_data_row) {
      [
        "Standards: #{first_grade_topic.name}",
        model_instance.name,
        model_instance.total_activity_count,
        model_instance.average_score,
        'Proficient'
      ]
    }

    let(:expected_model_data_size) {
      first_grade_topic_students.size
    }
  end
end