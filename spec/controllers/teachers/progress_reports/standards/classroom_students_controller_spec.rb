require 'rails_helper'

describe Teachers::ProgressReports::Standards::ClassroomStudentsController, type: :controller do
  include_context 'Topic Progress Report'

  it_behaves_like 'Progress Report' do
    let(:default_filters) { {classroom_id: full_classroom.id }}
    let(:result_key) { 'students' }
    let(:expected_result_count) { visible_students.size }
  end
end