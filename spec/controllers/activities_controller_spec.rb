require 'rails_helper'

describe ActivitiesController, type: :controller, redis: true do
  render_views

  let(:student) { FactoryGirl.create(:student) }
  let(:activity) { FactoryGirl.create(:activity) }
  let(:activity_session) { FactoryGirl.create(:activity_session,
                                              activity: activity,
                                              state: 'unstarted',
                                              user: student) }



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
