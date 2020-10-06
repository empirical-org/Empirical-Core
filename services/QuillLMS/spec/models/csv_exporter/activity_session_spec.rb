require 'rails_helper'

describe CsvExporter::ActivitySession do
  include_context 'Activity Progress Report'

  it_behaves_like 'CSV Exporter' do
    let(:expected_header_row) {
      [
        'Page Title',
        'Student',
        'Date',
        'Activity',
        'Score',
        'Standard Level',
        'Standard',
        'App'
      ]
    }

    let(:model_instance) {
      student_one_session
    }

    let(:filters) { { 'classroom_id' => classroom_one.id } }

    let(:expected_data_row) {
      [
        'Data Export',
        student_one_session.user.name,
        student_one_session.completed_at.to_formatted_s(:quill_default),
        student_one_session.activity.name,
        student_one_session.percentage_as_decimal,
        student_one_session.activity.standard.standard_level.name,
        student_one_session.activity.standard.name,
        # Concept (Standard Category(?)) -
        student_one_session.activity.classification.name
      ]
    }

    let(:expected_model_data_size) {
      classroom_one_sessions.size
    }
  end
end
