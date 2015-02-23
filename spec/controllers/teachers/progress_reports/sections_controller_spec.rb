require 'rails_helper'

describe Teachers::ProgressReports::SectionsController, :type => :controller do
  render_views

  let(:teacher) { FactoryGirl.create(:teacher) }
  let(:student) { FactoryGirl.create(:student) }
  let(:teacher_classroom) { FactoryGirl.create(:classroom, teacher: teacher, students: [student]) }
  let(:section) { FactoryGirl.create(:section) }

  before do
    ActivitySession.destroy_all
    3.times do |i| 
      topic = FactoryGirl.create(:topic, section: section)
      activity = FactoryGirl.create(:activity, topic: topic)
      classroom_activity = FactoryGirl.create(:classroom_activity, classroom: teacher_classroom, activity: activity)
      3.times do |j|
        activity_session = FactoryGirl.create(:activity_session, 
                                              classroom_activity: classroom_activity, 
                                              user: student,
                                              activity: activity, 
                                              state: 'finished',
                                              percentage: i / 3.0)
      end
    end
  end

  describe 'GET #index' do
    before do
      session[:user_id] = teacher.id # sign in, is there a better way to do this in test?
    end

    it 'displays the html' do
      get :index, {}
      expect(response.status).to eq(200)
    end
  end

  context 'XHR GET #index' do

    it 'requires a logged-in teacher' do
      get :index
      expect(response.status).to eq(401)
    end

    context 'when logged in' do
      before do
        session[:user_id] = teacher.id
      end

      it 'fetches aggregated section data' do
        xhr :get, :index
        expect(response.status).to eq(200)
        json = JSON.parse(response.body)
        expect(json['sections'].size).to eq(1)
        expect(json['sections'][0]['topics_count']).to eq('3')
      end
    end
  end
end
