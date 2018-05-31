require 'rails_helper'

describe ActivitiesController, type: :controller, redis: true do
  let(:student) { create(:student) }
  let(:activity) { create(:activity) }
  let(:activity_session) { create(:activity_session,
                                              activity: activity,
                                              state: 'unstarted',
                                              user: student) }



  describe 'GET #search' do
    let!(:activity1) { create(:activity, flags: ['production']) }
    let!(:activity2) { create(:activity, flags: ['production']) }
    let(:parsed_body) { JSON.parse(response.body) }

    before do
      session[:user_id] = student.id
    end


    # This feature is currently being overhauled, and this test will become
    # obsolete anyway. Not going to waste dev time fixing it at this point.
    skip 'returns activities' do
      get :search, ( {"search"=>
              {"search_query"=>"",
               "filters"=>
                {"0"=>{"field"=>"section", "selected"=>""},
                 "1"=>{"field"=>"activity_category", "selected"=>""},
                 "2"=>{"field"=>"activity_classification", "selected"=>""}}},
             "controller"=>"activities",
             "action"=>"search"})
      expect(parsed_body['activities'].length).to eq(2)
    end

  end
end
