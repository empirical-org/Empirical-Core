require 'rails_helper'

describe Teachers::ProgressReports::Standards::StandardStudentsController, type: :controller do
  include_context 'Standard Progress Report'

  it_behaves_like 'Progress Report' do
    let(:default_filters) { {classroom_id: full_classroom.id, standard_id: first_grade_standard.id }}
    let(:result_key) { 'students' }
    let(:expected_result_count) { first_grade_standard_students.size }

    it_behaves_like "exporting to CSV"
  end
end
