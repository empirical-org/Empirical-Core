require 'rails_helper'

describe ProfilesController, type: :controller do
  render_views

  describe 'as a student' do
    let(:student) { FactoryGirl.create(:student) }
    let(:activity) { FactoryGirl.create(:activity) }
    let(:unit) { FactoryGirl.create(:unit) }
    let(:classroom_activity) { FactoryGirl.create(:classroom_activity, activity: activity, unit: unit) }
    let!(:activity_session) { FactoryGirl.create(:activity_session_incompleted,
                                                classroom_activity: classroom_activity,
                                                activity: activity,
                                                state: 'unstarted',
                                                user: student) }

    before do
      session[:user_id] = student.id
    end

    subject do
      get :show
    end

    it 'loads the student profile' do
      subject
      expect(response.status).to eq(200)
    end
  end
end