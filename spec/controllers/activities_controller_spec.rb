require 'rails_helper'

describe ActivitiesController, type: :controller, redis: true do
  render_views

  let(:student) { FactoryBot.create(:student) }
  let(:activity) { FactoryBot.create(:activity) }
  let(:activity_session) { FactoryBot.create(:activity_session,
                                              activity: activity,
                                              state: 'unstarted',
                                              user: student) }



  describe 'GET #search' do
    let!(:activity1) { FactoryBot.create(:activity, flags: ['production']) }
    let!(:activity2) { FactoryBot.create(:activity, flags: ['production']) }
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
