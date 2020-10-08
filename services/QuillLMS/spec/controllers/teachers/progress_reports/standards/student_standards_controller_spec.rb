require 'rails_helper'

describe Teachers::ProgressReports::Standards::StudentStandardsController, type: :controller do
  include_context 'Standard Progress Report'

  it_behaves_like 'Progress Report' do
    let(:default_filters) { {classroom_id: full_classroom.id, student_id: alice.id }}
    let(:result_key) { 'standards' }
    let(:expected_result_count) { 2 }

    it_behaves_like "exporting to CSV"
  end
end
