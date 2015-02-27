require 'rails_helper'

describe ActivitiesController, :type => :controller do
  render_views

  let(:student) { FactoryGirl.create(:student) }
  let(:activity) { FactoryGirl.create(:activity) }
  let(:activity_session) { FactoryGirl.create(:activity_session,
                                              activity: activity,
                                              state: 'unstarted',
                                              user: student) }

  describe 'PUT' do
    it 'should start the activity session' do
      expect(activity_session.started_at).to be_nil
      put :update, { session: activity_session.id, id: activity.id}
      expect(activity_session.reload.started_at).to_not be_nil
      expect(response).to be_redirect
    end
  end

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
end