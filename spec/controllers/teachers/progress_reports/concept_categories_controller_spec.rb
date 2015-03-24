require 'rails_helper'

describe Teachers::ProgressReports::ConceptCategoriesController, :type => :controller do

  render_views

  let!(:teacher) { FactoryGirl.create(:teacher) }
  include_context 'Concept Progress Report'

  describe 'GET #index' do
    before do
      session[:user_id] = teacher.id # sign in, is there a better way to do this in test?
    end

    it 'displays the html' do
      get :index
      expect(response.status).to eq(200)
    end
  end

  context 'XHR GET #index' do
    it 'requires a logged-in teacher' do
      get :index
      expect(response.status).to eq(401)
    end

    context 'when logged in' do
      let(:json) { JSON.parse(response.body) }

      before do
        session[:user_id] = teacher.id
      end

      it 'fetches aggregated concept category data' do
        xhr :get, :index
        expect(response.status).to eq(200)
        expect(json['concept_categories'].size).to eq(visible_categories.size)
        expect(json['concept_categories'][0]['concept_tag_href'])
          .to eq(teachers_progress_reports_concept_category_concept_tags_path(concept_category_id: grammar_category.id))
      end

      it 'fetches classroom, unit, and student data for the filter options' do
        xhr :get, :index
        expect(json['classrooms'].size).to eq(1)
        expect(json['units'].size).to eq(1)
        expect(json['students'].size).to eq(1)
      end
    end
  end
end