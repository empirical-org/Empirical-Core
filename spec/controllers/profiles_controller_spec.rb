require 'rails_helper'

describe ProfilesController, type: :controller do
  render_views

  describe 'as a student' do
    let(:student) { FactoryBot.create(:student) }
    let(:activity) { FactoryBot.create(:activity) }
    let(:unit) { FactoryBot.create(:unit) }
    let(:classroom_activity) { FactoryBot.create(:classroom_activity, activity: activity, unit: unit) }
    let!(:activity_session) { FactoryBot.create(:activity_session_incompleted,
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