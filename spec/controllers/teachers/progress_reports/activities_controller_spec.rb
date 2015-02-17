require 'rails_helper'

describe Teachers::ProgressReports::ActivitiesController, :type => :controller do
  render_views

  describe 'getting a list of activity sessions' do
    let(:teacher) { FactoryGirl.create(:teacher) }
    let(:classroom) { FactoryGirl.create(:classroom_with_one_student, teacher: teacher) }
    let(:classroom_activity) { FactoryGirl.create(:classroom_activity, classroom: classroom, unit: classroom.units.first) }
    let(:activity_session) { FactoryGirl.create(:activity_session, 
                                                state: 'finished',
                                                classroom_activity: classroom_activity) }

    before do
      session[:user_id] = teacher.id # sign in, is there a better way to do this in test?
    end

    it 'displays the html' do
      get :index, {}
      expect(response.status).to eq(200)
    end
  end
end
