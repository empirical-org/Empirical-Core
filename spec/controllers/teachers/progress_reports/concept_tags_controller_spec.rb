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

      it 'fetches aggregated topics data' do
        subject
        expect(response.status).to eq(200)
        expect(json['concept_tags'].size).to eq(@writing_category_tags.size)
      end
    end
  end
end