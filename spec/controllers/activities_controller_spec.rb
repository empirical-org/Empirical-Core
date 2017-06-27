require 'rails_helper'

describe ActivitiesController, type: :controller, redis: true do
  render_views

  let(:student) { FactoryGirl.create(:student) }
  let(:activity) { FactoryGirl.create(:activity) }
  let(:activity_session) { FactoryGirl.create(:activity_session,
                                              activity: activity,
                                              state: 'unstarted',
                                              user: student) }



  describe 'POST #retry' do
    let(:classroom_activity) { FactoryGirl.create(:classroom_activity, activity: activity, classroom: classroom) }
    let(:classroom)  { FactoryGirl.create(:classroom) }

    before do
      session[:user_id] = student.id
    end

    it 'should create a new activity session and start it' do
      expect {
        post :retry, { classroom_activity_id: classroom_activity.id, id: activity.id}
      }.to change(ActivitySession, :count).by(1)
      created_session = ActivitySession.find_by_classroom_activity_id(classroom_activity.id)
      expect(created_session.is_retry).to be(true)
      expect(created_session.state).to eq('started')
      expect(created_session.started_at).to_not be_nil
    end
  end


  describe 'GET #search' do
    let!(:activity1) { FactoryGirl.create(:activity, flags: ['production']) }
    let!(:activity2) { FactoryGirl.create(:activity, flags: ['production']) }
    let(:parsed_body) { JSON.parse(response.body) }

    before do
      session[:user_id] = student.id
    end


    it 'returns activities' do
      get :search, ( {"search"=>
              {"search_query"=>"",
               "filters"=>
                {"0"=>{"field"=>"section", "selected"=>""},
                 "1"=>{"field"=>"topic_category", "selected"=>""},
                 "2"=>{"field"=>"activity_classification", "selected"=>""}}},
             "controller"=>"activities",
             "action"=>"search"})
      expect(parsed_body['activities'].length).to eq(2)
    end

  end
end
