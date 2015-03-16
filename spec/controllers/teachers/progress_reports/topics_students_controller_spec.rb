require 'rails_helper'

describe Teachers::ProgressReports::TopicsStudentsController, :type => :controller do
  include ProgressReportHelper
  render_views

  let!(:teacher) { FactoryGirl.create(:teacher) }
  let(:json) { JSON.parse(response.body) }

  describe 'when not logged in' do
    # IDs don't matter for non-XHR get request
    subject { get :index, {section_id: 123, topic_id: 123} }

    it 'requires a logged-in teacher' do
      subject
      expect(response.status).to eq(401)
    end
  end

  describe 'when logged in' do
    before do
      session[:user_id] = teacher.id # sign in, is there a better way to do this in test?
    end

    subject { get :index, {section_id: @section.id, topic_id: @first_grade_topic.id} }

    before do
      setup_topics_progress_report
    end

    describe 'GET #index' do
      it 'displays the html' do
        subject
        expect(response.status).to eq(200)
      end
    end

    context 'XHR GET #index' do
      subject { xhr :get, :index, {section_id: @section.id, topic_id: @first_grade_topic.id} }

      it 'fetches aggregated students data' do
        subject
        expect(response.status).to eq(200)
        expect(json['students'].size).to eq(@first_grade_topic_students.size)
        alice = json['students'][0]
        expect(alice['name']).to eq(@alice.name)
        expect(alice['activity_session_count']).to eq(1) # 1 activity session for Alice
        expect(alice['proficient_count']).to eq(1)
        expect(alice['not_proficient_count']).to eq(0)
      end

      it 'fetches additional data for the filters' do
        subject
        expect(json['classrooms'].size).to eq(1)
        expect(json['units'].size).to eq(1)
        expect(json).to have_key('topic')
      end
    end
  end
end