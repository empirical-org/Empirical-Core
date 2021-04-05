require 'rails_helper'

describe Api::V1::ActivitiesController, type: :controller do
  context 'GET #show' do
    include_context 'calling api with doorkeeper bypass'
    
    let(:activity) { create :activity }

    it 'responds with 200' do
      get :show, 
        params: { id: activity.uid}, 
        format: :json 

      expect(response.status).to eq(200)
    end

    it 'responds with 404 if activity does not exist' do
      get :show, 
        params: { id: 'doesnotexist' },
        format: :json 

      expect(response.status).to eq(404)
    end
  end

  context 'PUT #update' do
    include_context 'calling api with doorkeeper bypass'

    let!(:activity) { create(:activity) }

    let(:http_request) do
      put :update, 
        params: { 
          id: activity.uid, 
          name: 'foobar'
        },
        format: :json 
    end

    before do 
      http_request
      @parsed_body = JSON.parse(response.body) 
    end

    it 'responds with 200' do
      expect(response.status).to eq(200)
    end

    it_behaves_like 'an api request'
  end

  context 'POST #create' do
    include_context 'calling api with doorkeeper bypass'

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
        }
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
      let!(:activity) { create(:activity) }

      it 'responds with 422 Unprocessable Entity' do
        post :create, params: { uid: activity.uid }
        expect(response.status).to eq(422)
      end
    end
  end

  describe '#destroy' do
    include_context 'calling api with doorkeeper bypass'

    let(:activity) { create(:activity) }

    context 'when the destroy is successful' do
      it 'should return the success json' do
        get :destroy,
         params: { id: activity.uid},
         format: :json 

        expect(JSON.parse(response.body)["meta"])
          .to eq({"status" => 'success', "message" => "Activity Destroy Successful", "errors" => nil})
      end
    end

    context 'when the destroy is not successful' do
      before { allow_any_instance_of(Activity).to receive(:destroy!) { false } }

      it 'should return the failed json' do
        get :destroy, 
          params: { id: activity.uid },
          format: :json

        expect(JSON.parse(response.body)["meta"])
          .to eq({"status" => 'failed', "message" => "Activity Destroy Failed", "errors" => {}})
      end
    end
  end

  describe '#follow_up_activity_name_and_supporting_info' do
    include_context 'calling api with doorkeeper bypass'

    let(:follow_up_activity) { create(:activity) }
    let(:activity) { create(:activity, follow_up_activity: follow_up_activity) }

    it 'should render the correct json' do
      get :follow_up_activity_name_and_supporting_info, 
        params: { id: activity.id },
        format: :json

      expect(response.body).to eq({
        follow_up_activity_name: activity.follow_up_activity.name,
        supporting_info: activity.supporting_info
      }.to_json)
    end
  end

  describe '#supporting_info' do
    let(:activity) { create(:activity) }

    it 'should render the correct json' do
      get :supporting_info, 
        params: { id: activity.id },
        format: :json

      expect(response.body).to eq ({supporting_info: activity.supporting_info}.to_json)
    end
  end

  describe '#uids_and_flags' do
    let!(:activity) { create(:activity) }
    let!(:activity1) { create(:activity) }

    it 'should render the correct json' do
      get :uids_and_flags

      expect(JSON.parse(response.body)).to eq({
        activity.uid => { "flag" => activity.flag.to_s },
        activity1.uid => { "flag" => activity1.flag.to_s }
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
      get :published_edition
      expect(Checkbox.find_by(objective_id: objective.id, user_id: user.id)).to_not eq nil
      expect(UserMilestone.find_by(milestone_id: milestone.id, user_id: user.id)).to_not eq nil
    end
  end

  context 'when not authenticated via OAuth' do
    it 'POST #create returns 401 Unauthorized' do
      post :create, format: :json
      expect(response.status).to eq(401)
    end

    it 'PUT #update returns 401 Unauthorized' do
      activity = create(:activity)
      put :update, 
        params: {  id: activity.uid }, 
        format: :json

      expect(response.status).to eq(401)
    end

    it 'DELETE #destroy returns 401 Unauthorized' do
      activity = create(:activity)
      delete :destroy, params: { id: activity.uid }, format: :json
      expect(response.status).to eq(401)
    end
  end
end
