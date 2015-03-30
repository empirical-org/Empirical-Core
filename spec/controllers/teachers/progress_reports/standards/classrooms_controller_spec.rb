require 'rails_helper'

describe Teachers::ProgressReports::Standards::ClassroomsController, type: :controller do
  render_views

  let!(:teacher) { FactoryGirl.create(:teacher) }
  it_behaves_like 'Progress Report' do
    let(:result_key) { 'classrooms' }
    let(:expected_result_count) { 0 }
  end
end
