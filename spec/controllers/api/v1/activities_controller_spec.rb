require 'rails_helper'

describe Api::V1::ActivitiesController, type: :controller do

  context 'GET #show' do
    include_context "calling the api"

    before do
      @activity1 = create(:activity)

      get :show, format: :json, id: @activity1.uid
      @parsed_body = JSON.parse(response.body)
    end

    # it_behaves_like "an api request"

    it 'responds with 200' do
      expect(response.status).to eq(200)
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
      put :update, format: :json, id: activity.uid, name: 'foobar'
      @parsed_body = JSON.parse(response.body)
    end

    it_behaves_like 'an api request'

    it 'responds with 200' do
      expect(response.status).to eq(200)
    end
  end

  context 'POST #create' do
    include_context 'calling the api'
    let(:topic) { create(:topic) }
    let(:section) { create(:section) }
    let(:activity_classification) { create(:activity_classification) }

    subject do
      post :create, {
        name: 'foobar',
        uid: 'abcdef123',
        topic_uid: topic.uid,
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

        it 'sets topic_id from topic_uid' do
          expect(activity.topic).to be_present
        end

        it 'sets activity_classification_id from activity_classification_uid' do
          expect(activity.classification).to be_present
        end
      end
    end

    describe 'when the request is valid' do
      it 'creates an activity' do
        expect {
          subject
        }.to change(Activity, :count).by(1)
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
        post :create, foobar: 'whatever', uid: another_activity.uid
        expect(response.status).to eq(422)
      end
    end
  end

  context 'when not authenticated via OAuth' do
    it 'POST #create returns 401 Unauthorized' do
      post :create, format: :json
      expect(response.status).to eq(401)
    end

    it 'PUT #update returns 401 Unauthorized' do
      activity = create(:activity)
      put :update, format: :json, id: activity.uid
      expect(response.status).to eq(401)
    end

    it 'DELETE #destroy returns 401 Unauthorized' do
      activity = create(:activity)
      delete :destroy, format: :json, id: activity.uid
      expect(response.status).to eq(401)
    end
  end
end
