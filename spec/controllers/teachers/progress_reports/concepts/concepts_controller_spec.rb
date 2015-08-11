require 'rails_helper'

describe Teachers::ProgressReports::Concepts::ConceptsController, :type => :controller do
  let!(:teacher) { FactoryGirl.create(:teacher) }
  include_context 'Concept Progress Report'
  it_behaves_like 'Progress Report' do
    let(:result_key) { 'concepts' }
    let(:default_filters) { { student_id: student.id } }
    let(:expected_result_count) { activity_session.concepts.size }
  end

  context 'GET #index json' do
    context 'when logged in' do
      let(:json) { JSON.parse(response.body) }
      subject { get :index, student_id: student.id, format: :json }
      before do
        session[:user_id] = teacher.id
      end

      it 'includes a list of concepts in the JSON' do
        subject
        expect(json).to have_key('concepts')
        expect(json['concepts'].size).to be > 0
      end
    end
  end
end