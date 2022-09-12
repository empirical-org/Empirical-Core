# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::ActivitiesController, type: :controller do

  context 'GET #show' do
    include_context "calling the api"

    before do
      @activity1 = create(:activity)

      get :show, params: { id: @activity1.uid }, as: :json
      @parsed_body = JSON.parse(response.body)
    end

    # it_behaves_like "an api request"

    it 'responds with 200' do
      expect(response.status).to eq(200)
    end

    it 'responds with 404 if activity does not exist' do
      get :show, params: { id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
    end

    # it "should have an object at it's root" do
    #   expect(@parsed_body.keys).to include('status')
    # end
    #
    # it "should present a uid" do
    #   expect(@parsed_body['object']['uid']).to eq(@activity1.uid)
    # end
  end

  context 'PUT #update' do
    include_context "calling the api" # this handles the doorkeeper auth

    let!(:activity) { create(:activity) }

    before do
      put :update, params: { id: activity.uid, name: 'foobar' }, as: :json
      @parsed_body = JSON.parse(response.body)
    end

    it_behaves_like 'an api request'

    it 'responds with 200' do
      expect(response.status).to eq(200)
    end
  end

  context 'POST #create' do
    include_context 'calling the api'
    let(:standard) { create(:standard) }
    let(:standard_level) { create(:standard_level) }
    let(:activity_classification) { create(:activity_classification) }

    subject do
      post :create,
        params: {
          name: 'foobar',
          uid: 'abcdef123',
          standard_uid: standard.uid,
          activity_classification_uid: activity_classification.uid
        },
        as: :json
    end

    describe 'general API behavior' do
      before do
        subject
        @parsed_body = JSON.parse(response.body)
      end

      it_behaves_like 'an api request'

      it 'allows setting the uid field on the activity' do
        expect(@parsed_body['activity']['uid']).to eq('abcdef123')
      end

      it 'flags activities as beta by default' do
        expect(@parsed_body['activity']['flags']).to eq(['beta'])
      end

      describe 'handles uid information' do
        let(:activity) { Activity.find_by_uid(@parsed_body['activity']['uid']) }

        it 'sets standard_id from standard_uid' do
          expect(activity.standard).to be_present
        end

        it 'sets activity_classification_id from activity_classification_uid' do
          expect(activity.classification).to be_present
        end
      end
    end

    describe 'when the request is valid' do
      it 'creates an activity' do
        expect { subject }.to change(Activity, :count).by(1)
      end

      it 'responds with 200' do
        expect(response.status).to eq(200)
      end
    end

    describe 'when there was an error creating the activity' do
      it 'responds with 422 Unprocessable Entity' do
        # So far the only way to create an invalid activity
        # is to give it a non-unique uid.
        another_activity = create(:activity)
        post :create, params: { foobar: 'whatever', uid: another_activity.uid }
        expect(response.status).to eq(422)
      end
    end
  end

  describe '#destroy' do
    include_context "calling the api" # this handles the doorkeeper auth
    let(:activity) { create(:activity) }

    context 'when the destroy is successful' do
      it 'should return the success json' do
        get :destroy, params: { id: activity.uid }, as: :json
        expect(JSON.parse(response.body)["meta"]).to eq({"status" => 'success', "message" => "Activity Destroy Successful", "errors" => nil})
      end
    end

    context 'when the destroy is not successful' do
      before { allow_any_instance_of(Activity).to receive(:destroy!) { false } }

      it 'should return the failed json' do
        get :destroy, params: { id: activity.uid }, as: :json
        expect(JSON.parse(response.body)["meta"]).to eq({"status" => 'failed', "message" => "Activity Destroy Failed", "errors" => {}})
      end
    end
  end

  describe '#follow_up_activity_name_and_supporting_info' do
    include_context "calling the api" # this handles the doorkeeper auth
    let(:follow_up_activity) { create(:activity) }
    let(:activity) { create(:activity, follow_up_activity: follow_up_activity) }

    it 'should render the correct json' do
      get :follow_up_activity_name_and_supporting_info, params: { id: activity.id }, as: :json
      expect(response.body).to eq({
        follow_up_activity_name: activity.follow_up_activity.name,
        supporting_info: activity.supporting_info
      }.to_json)
    end
  end

  describe '#supporting_info' do
    let(:activity) { create(:activity) }

    it 'should render the correct json' do
      get :supporting_info, params: { id: activity.id }, as: :json
      expect(response.body).to eq ({supporting_info: activity.supporting_info}.to_json)
    end
  end

  describe '#uids_and_flags' do
    let!(:activity) { create(:activity) }
    let!(:activity1) { create(:activity) }

    it 'should render the correct json' do
      get :uids_and_flags, as: :json
      expect(JSON.parse(response.body)).to eq({
        activity.uid => {
          "flag" => activity.flag.to_s
        },
        activity1.uid => {
          "flag" => activity1.flag.to_s
        }
      })
    end
  end

  describe '#published_edition' do
    let(:objective) { create(:objective, name: "Publish Customized Lesson") }
    let(:milestone) { create(:milestone, name: "Publish Customized Lesson") }
    let(:user) { create(:user) }

    before { allow(controller).to receive(:current_user) { user } }

    it 'should create the usermilestone and checkbox' do
      expect(Checkbox.find_by(objective_id: objective.id, user_id: user.id)).to eq nil
      expect(UserMilestone.find_by(milestone_id: milestone.id, user_id: user.id)).to eq nil
      get :published_edition, as: :json
      expect(Checkbox.find_by(objective_id: objective.id, user_id: user.id)).to_not eq nil
      expect(UserMilestone.find_by(milestone_id: milestone.id, user_id: user.id)).to_not eq nil
    end
  end

  describe 'diagnostic_activities' do
    let!(:connect_activity) { create(:connect_activity) }
    let!(:diagnostic_activity_one) { create(:diagnostic_activity) }
    let!(:diagnostic_activity_two) { create(:diagnostic_activity) }

    it 'should return a list of diagnostic activities' do
      get :diagnostic_activities, as: :json
      response_obj = JSON.parse(response.body)['diagnostics']
      expect(response_obj.size).to eq(2)
      expect([diagnostic_activity_one.id, diagnostic_activity_two.id]).to include(response_obj[0]["id"])
      expect([diagnostic_activity_one.id, diagnostic_activity_two.id]).to include(response_obj[1]["id"])
    end
  end

  describe '#question_health' do
    let!(:connect) { create(:activity_classification, key: ActivityClassification::CONNECT_KEY) }
    let!(:question) { create(:question)}
    let!(:activity) { create(:activity, activity_classification_id: connect.id) }
    let!(:activity_session1) { create(:activity_session_without_concept_results, activity: activity) }
    let!(:activity_session2) { create(:activity_session_without_concept_results, activity: activity) }
    let!(:activity_session3) { create(:activity_session_without_concept_results, activity: activity) }
    let!(:concept_result1) do
      create(:concept_result, activity_session: activity_session1, question_number: 1, question_score: 1)
    end

    let!(:concept_result2) do
      create(:concept_result, activity_session: activity_session2, question_number: 1, question_score: 0.75)
    end

    let!(:concept_result3) do
      create(:concept_result, activity_session: activity_session3, question_number: 1, question_score: 0)
    end

    before do
      ENV['DEFAULT_URL'] = 'https://quill.org'
      ENV['CMS_URL'] = 'https://cms.quill.org'
      stub_request(:get, "#{ENV['CMS_URL']}/questions/#{question.uid}/question_dashboard_data")
        .to_return(status: 200, body: { percent_common_unmatched: 50,  percent_specified_algos: 75}.to_json, headers: {})
    end

    it 'should return a list of all questions and their health' do
      activity.update(data: {questions: [{key: question.uid}]})
      get :question_health, params: { id: activity.id }, as: :json

      response_obj = JSON.parse(response.body)["question_health"]
      expect(response_obj[0]["url"]).to eq("https://quill.org/connect/#/admin/questions/#{question.uid}/responses")
      expect(response_obj[0]["text"]).to eq(question.data['prompt'])
      expect(response_obj[0]["flag"]).to eq(question.data['flag'])
      expect(response_obj[0]["incorrect_sequences"]).to eq(question.data["incorrectSequences"].length)
      expect(response_obj[0]["focus_points"]).to eq(question.data["focusPoints"].length)
      expect(response_obj[0]["percent_common_unmatched"]).to eq(50)
      expect(response_obj[0]["percent_specified_algorithms"]).to eq(75)
      expect(response_obj[0]["difficulty"]).to eq(2.67)
      expect(response_obj[0]["percent_reached_optimal"]).to eq(66.67)
    end

    it 'returns empty hashes if questions do not exist' do
      activity.update(data: {questions: [{key: question.uid}, {key: SecureRandom.uuid}]})
      get :question_health, params: { id: activity.id }, as: :json
      expect(response.status).to eq(200)
      response_obj = JSON.parse(response.body)["question_health"]
      expect(response_obj[1]).to eq({})
    end
  end

  describe '#activities_health' do
    let!(:prompt_health) { create(:prompt_health)}
    let!(:activity_health) {create(:activity_health, prompt_healths: [prompt_health])}

    it 'should return a list of all activity healths with associated prompt health' do
      get :activities_health, as: :json
      expect(response.status).to eq(200)
      response_obj = JSON.parse(response.body)["activities_health"]
      expect(response_obj[0]).to eq(ActivityHealth.first.as_json)
    end

    it 'should return an empty list if no activity healths exist' do
      ActivityHealth.destroy_all
      get :activities_health, as: :json
      expect(response.status).to eq(200)
      response_obj = JSON.parse(response.body)["activities_health"]
      expect(response_obj).to eq([])
    end
  end

  context 'when not authenticated via OAuth' do
    it 'POST #create returns 401 Unauthorized' do
      post :create, as: :json
      expect(response.status).to eq(401)
    end

    it 'PUT #update returns 401 Unauthorized' do
      activity = create(:activity)
      put :update, params: { id: activity.uid }, as: :json
      expect(response.status).to eq(401)
    end

    it 'DELETE #destroy returns 401 Unauthorized' do
      activity = create(:activity)
      delete :destroy, params: { id: activity.uid }, as: :json
      expect(response.status).to eq(401)
    end
  end
end
