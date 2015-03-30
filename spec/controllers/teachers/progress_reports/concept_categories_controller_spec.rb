require 'rails_helper'

describe Teachers::ProgressReports::ConceptCategoriesController, :type => :controller do
  let!(:teacher) { FactoryGirl.create(:teacher) }
  include_context 'Concept Progress Report'
  it_behaves_like 'Progress Report'

  context 'XHR GET #index' do
    context 'when logged in' do
      let(:json) { JSON.parse(response.body) }
      subject { xhr :get, :index }
      before do
        session[:user_id] = teacher.id
      end

      it 'fetches aggregated concept category data' do
        subject
        expect(json['concept_categories'].size).to eq(visible_categories.size)
        expect(json['concept_categories'][0]['concept_tag_href'])
          .to eq(teachers_progress_reports_concept_category_concept_tags_path(concept_category_id: grammar_category.id))
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