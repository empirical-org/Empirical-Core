require 'rails_helper'

describe Teachers::ProgressReports::Standards::ClassroomsController, type: :controller do
  include_context 'Topic Progress Report'
  it_behaves_like 'Progress Report' do
    let(:result_key) { 'classrooms' }
    let(:expected_result_count) { visible_classrooms.size }

    it_behaves_like "exporting to CSV"
  end
end
