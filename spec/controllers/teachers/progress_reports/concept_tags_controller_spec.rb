require 'rails_helper'

describe Teachers::ProgressReports::ConceptTagsController, :type => :controller do
  include ProgressReportHelper
  render_views

  let!(:teacher) { FactoryGirl.create(:teacher) }

  before do
    setup_concepts_progress_report
  end

  describe 'GET #index' do
    subject do
      get :index, {concept_category_id: @writing_category}
    end

    before do
      session[:user_id] = teacher.id # sign in, is there a better way to do this in test?
    end

    it 'displays the html' do
      subject
      expect(response.status).to eq(200)
    end
  end

  context 'XHR GET #index' do
    subject do
      xhr :get, :index, {concept_category_id: @writing_category}
    end

    it 'requires a logged-in teacher' do
      subject
      expect(response.status).to eq(401)
    end

    context 'when logged in' do
      let(:json) { JSON.parse(response.body) }

      before do
        session[:user_id] = teacher.id
      end

      it 'fetches aggregated concept tags data' do
        subject
        expect(response.status).to eq(200)
        expect(json['concept_tags'].size).to eq(@writing_category_tags.size)
        expect(json['concept_tags'][0]['concept_tag_name']).to eq(@writing_tag.name)
        expect(json['concept_tags'][0]['students_href'])
          .to eq(teachers_progress_reports_concept_category_concept_tag_students_path(
            concept_category_id: @writing_category.id,
            concept_tag_id: @writing_tag.id
          ))
      end

      it 'fetches the parent concept category data' do
        subject
        expect(json['concept_category']['concept_category_name']).to eq(@writing_category.name)
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