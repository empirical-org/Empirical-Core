require 'rails_helper'

describe Teachers::ProgressReports::Standards::ClassroomTopicsController, type: :controller do
  include_context 'Topic Progress Report'

  it_behaves_like 'Progress Report' do
    let(:default_filters) { {classroom_id: full_classroom.id }}
    let(:result_key) { 'topics' }
    let(:expected_result_count) { visible_topics.size }

    it_behaves_like "filtering progress reports by Unit" do
      let(:filter_value) { empty_unit.id }
      let(:expected_result_count) { 0 }
    end

    it_behaves_like "exporting to CSV"
  end
end