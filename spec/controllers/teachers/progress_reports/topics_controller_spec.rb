require 'rails_helper'

describe Teachers::ProgressReports::TopicsController, :type => :controller do
  include ProgressReportHelper
  render_views

  let!(:teacher) { FactoryGirl.create(:teacher) }

  before do
    setup_topics_progress_report
  end

  describe 'GET #index' do
    before do
      session[:user_id] = teacher.id # sign in, is there a better way to do this in test?
    end

    it 'displays the html' do
      get :index, {section_id: @section.id}
      expect(response.status).to eq(200)
    end
  end

  context 'XHR GET #index' do
    it 'requires a logged-in teacher' do
      get :index, {section_id: @section.id}
      expect(response.status).to eq(401)
    end

    context 'when logged in' do
      let(:json) { JSON.parse(response.body) }

      before do
        session[:user_id] = teacher.id
      end

      it 'fetches aggregated section data' do
        xhr :get, :index, {section_id: @section.id}
        expect(response.status).to eq(200)
        expect(json['topics'].size).to eq(@visible_topics.size)
      end
    end
  end
end