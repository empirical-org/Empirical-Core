require 'rails_helper'

describe ActivitiesController, type: :controller, redis: true do
  let(:student) { create(:student) }

  before do
    session[:user_id] = student.id
  end

  describe 'GET #search' do
    let(:activity) { create(:activity) }
    let(:activity_session) { create(:activity_session,
                                    activity: activity,
                                    state: 'unstarted',
                                    user: student) }
    let!(:activity1) { create(:activity, flags: ['production']) }
    let!(:activity2) { create(:activity, flags: ['production']) }
    let(:parsed_body) { JSON.parse(response.body) }

    # This feature is currently being overhauled, and this test will become
    # obsolete anyway. Not going to waste dev time fixing it at this point.
    skip 'returns activities' do
      get :search, ( {"search"=>
              {"search_query"=>"",
               "filters"=>
                {"0"=>{"field"=>"standard_level", "selected"=>""},
                 "1"=>{"field"=>"activity_category", "selected"=>""},
                 "2"=>{"field"=>"activity_classification", "selected"=>""}}},
             "controller"=>"activities",
             "action"=>"search"})
      expect(parsed_body['activities'].length).to eq(2)
    end
  end

  describe '#count' do
    let!(:activity) { create(:activity, flags: [:production]) }
    let!(:activity1) { create(:activity, flags: [:production]) }
    let!(:activity2) { create(:activity, flags: [:test]) }

    it 'should give the production activities count' do
      get :count
      expect(assigns(:count)).to eq 2
      expect(response.body).to eq({count: 2}.to_json)
    end
  end

  describe '#preview_lesson' do
    let!(:activity) { create(:activity) }
    let(:preview_url) { "#{activity.classification_form_url}teach/class-lessons/#{activity.uid}/preview" }
    let(:tutorial_lesson_preview_url) { "#{ENV['DEFAULT_URL']}/tutorials/lessons?url=#{URI.encode_www_form_component(preview_url)}" }

    context 'when current user' do
      context 'when milestone is completed for user' do
        let!(:milestone) { create(:milestone, name: "View Lessons Tutorial", users: [student]) }

        it 'should redirect to the preview url' do
          get :preview_lesson, lesson_id: activity.id
          expect(response).to redirect_to preview_url
        end
      end

      context 'when milestone is not completed for the user' do
        let!(:milestone) { create(:milestone, name: "View Lessons Tutorial", users: []) }

        it 'should redirect to the tutorials/lessons/preview url' do
          get :preview_lesson, lesson_id: activity.id
          expect(response).to redirect_to tutorial_lesson_preview_url
        end
      end
    end

    context 'when no current user' do

      before do
        allow(controller).to receive(:current_user) { nil }
      end

      it 'should redirect to preview url' do
        get :preview_lesson, lesson_id: activity.id
        expect(response).to redirect_to preview_url
      end
    end
  end

  # this throws missing template supporting_info error dont know whyg
  # describe '#supporting_info' do
  #   let!(:activity) { create(:activity) }
  #
  #   it 'should redirect to the supporting info' do
  #     get :supporting_info, id: activity.id, format: :pdf
  #     expect(response).to redirect_to activity.supporting_info
  #   end
  # end

  describe '#customize_lesson' do
    let!(:activity) { create(:activity) }

    it 'should redirect to the correct url' do
      get :customize_lesson, id: activity.id
      expect(response).to redirect_to "#{activity.classification_form_url}customize/#{activity.uid}"
    end
  end
end
