require 'rails_helper'

describe Teachers::ProgressReports::ConceptTagsController, :type => :controller do

  render_views

  let!(:teacher) { FactoryGirl.create(:teacher) }

  include_context 'Concept Progress Report'
  it_behaves_like 'Progress Report' do
    let(:default_filters) { {concept_category_id: writing_category} }
    let(:result_key) { 'concept_tags' }
    let(:expected_result_count) { writing_category_tags.size }
  end

  context 'XHR GET #index' do
    subject do
      xhr :get, :index, {concept_category_id: writing_category}
    end

    context 'when logged in' do
      let(:json) { JSON.parse(response.body) }

      before do
        session[:user_id] = teacher.id
      end

      it 'includes the concept tag name in the JSON response' do
        subject
        expect(json['concept_tags'][0]['concept_tag_name']).to eq(writing_tag.name)
      end

      it 'includes links to students in the JSON response' do
        subject
        expect(json['concept_tags'][0]['students_href'])
          .to eq(teachers_progress_reports_concept_category_concept_tag_students_path(
            concept_category_id: writing_category.id,
            concept_tag_id: writing_tag.id
          ))
      end

      it 'fetches the parent concept category data' do
        subject
        expect(json['concept_category']['concept_category_name']).to eq(writing_category.name)
      end

      it 'fetches classroom, unit, and student data for the filter options' do
        subject
        expect(json['classrooms'].size).to eq(1)
        expect(json['units'].size).to eq(1)
        expect(json['students'].size).to eq(1)
      end
    end
  end
end