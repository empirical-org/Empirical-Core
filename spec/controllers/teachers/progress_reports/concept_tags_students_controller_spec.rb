require 'rails_helper'

describe Teachers::ProgressReports::ConceptTagsStudentsController, :type => :controller do

  render_views

  let!(:teacher) { FactoryGirl.create(:teacher) }
  let(:json) { JSON.parse(response.body) }
  let(:basic_filters) { {concept_tag_id: concept_tag.id, concept_category_id: concept_category.id} }
  include_context 'Student Concept Progress Report'
  it_behaves_like 'Progress Report' do
    let(:default_filters) { basic_filters }
    let(:result_key) { 'students' }
    let(:expected_result_count) { visible_students.size }
  end

  describe 'when logged in' do
    before do
      session[:user_id] = teacher.id # sign in, is there a better way to do this in test?
    end

    context 'XHR GET #index' do
      subject { xhr :get, :index, basic_filters }

      it 'fetches aggregated students data' do
        subject
        alice_json = json['students'][0]
        expect(alice_json['name']).to eq(alice.name)
        expect(alice_json['total_result_count'].to_i).to eq(alice_session.concept_tag_results.size)
        expect(alice_json['correct_result_count'].to_i).to eq(1)
        expect(alice_json['incorrect_result_count'].to_i).to eq(1)
      end

      it 'fetches additional data for the filters' do
        subject
        expect(json['classrooms'].size).to eq(1)
        expect(json['units'].size).to eq(1)
        expect(json).to have_key('concept_tag')
      end
    end
  end
end