# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::ActivitiesController, type: :controller do
  let(:user) { create(:user) }
  let(:parsed_body) { JSON.parse(response.body) }

  before { allow(controller).to receive(:current_user) { user } }

  context 'GET #show' do
    let(:parsed_body) { JSON.parse(response.body) }

    before { get :show, params: { id: activity_id }, as: :json }

    context 'valid activity' do
      let(:activity_id) { create(:activity).uid  }

      it_behaves_like 'an api request'

      it  { expect(response.status).to eq(200) }
    end

    context 'invalid activity' do
      let(:activity_id) { 'doesnotexist' }

      it { expect(response).to be_not_found }
    end
  end

  context 'PUT #update' do
    let(:activity) { create(:activity) }

    before { put :update, params: { id: activity.uid, name: 'foobar' }, as: :json }

    it { expect(response).to be_redirect }

    context 'as staff' do
      let(:user) { create(:staff) }

      it_behaves_like 'an api request'

      it { expect(response).to have_http_status(:ok) }
    end
  end

  context 'POST #create' do
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
      before { subject }

      it { expect(response).to be_redirect }
      it { expect(Activity.count).to eq 0 }

      context 'as staff' do
        let(:user) { create(:staff) }

        it_behaves_like 'an api request'

        it { expect(Activity.count).to eq 1 }

        it { expect(response).to have_http_status(:ok) }

        it { expect(parsed_body['activity']['uid']).to eq('abcdef123') }
        it { expect(parsed_body['activity']['flags']).to eq(['beta']) }

        describe 'handles uid information' do
          let(:activity) { Activity.find_by_uid(parsed_body['activity']['uid']) }

          it { expect(activity).to be_present }
          it { expect(activity.classification).to be_present }
        end

        describe 'when there was an error creating the activity' do
          # Try to create a duplicate
          before { post :create, params: { uid: create(:activity).uid } }

          it { expect(response).to have_http_status(:unprocessable_entity) }
        end
      end
    end
  end

  describe 'DELETE #destroy' do
    subject { delete :destroy, params: { id: activity.uid }, as: :json }

    let(:activity) { create(:activity) }

    context 'when not staff' do
      before { subject }

      it { expect(Activity.count).to eq 1 }
      it { expect(response).to be_redirect }
    end

    context 'when staff' do
      let(:user) { create(:staff) }

      context 'when the destroy is successful' do
        let(:meta) { { "status" => 'success', "message" => "Activity Destroy Successful", "errors" => nil } }

        before { subject }

        it { expect(parsed_body["meta"]).to eq meta }
      end

      context 'when the destroy is not successful' do
        let(:meta) { { "status" => 'failed', "message" => "Activity Destroy Failed", "errors" => {} } }

        before do
          allow(activity).to receive(:destroy).and_return(false)
          allow(Activity).to receive(:find_by_uid).with(activity.uid).and_return(activity)
          subject
        end

        it { expect(parsed_body["meta"]).to eq meta }
      end
    end
  end

  describe '#follow_up_activity_name_and_supporting_info' do
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
      expect(parsed_body).to eq({
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
      response_obj = parsed_body['diagnostics']
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

      response_obj = parsed_body["question_health"]
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
      response_obj = parsed_body["question_health"]
      expect(response_obj[1]).to eq({})
    end
  end

  describe '#activities_health' do
    let!(:prompt_health) { create(:prompt_health)}
    let!(:activity_health) {create(:activity_health, prompt_healths: [prompt_health])}

    it 'should return a list of all activity healths with associated prompt health' do
      get :activities_health, as: :json
      expect(response.status).to eq(200)
      response_obj = parsed_body["activities_health"]
      expect(response_obj[0]).to eq(ActivityHealth.first.as_json)
    end

    it 'should return an empty list if no activity healths exist' do
      ActivityHealth.destroy_all
      get :activities_health, as: :json
      expect(response.status).to eq(200)
      response_obj = parsed_body["activities_health"]
      expect(response_obj).to eq([])
    end
  end
end
