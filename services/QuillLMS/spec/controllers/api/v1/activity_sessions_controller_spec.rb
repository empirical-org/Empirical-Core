require 'rails_helper'

describe Api::V1::ActivitySessionsController, type: :controller do


  describe '#update' do
    let(:token) { double :acceptable? => true, resource_owner_id: user.id }
    let(:user) { create(:student) }

    before do
      allow(controller).to receive(:doorkeeper_token) {token}
      @activity_session = create(:activity_session, state: 'started', user: user, completed_at: nil)
    end

    it 'passes activity session and user to notifier service' do
      service_instance = double(:service_instance)

      expect(NotifyOfCompletedActivity).to receive(:new)
        .with(@activity_session)
        .and_return(service_instance)
      expect(service_instance).to receive(:call)

      put :update, id: @activity_session.uid, state: 'finished'
    end

    context 'default behavior' do
      include_context "calling the api"

      before do
        subject
        @parsed_body = JSON.parse(response.body)
      end

      def subject
        # FIXME: URL Parameter should be called uid, not id, because that is confusing
        put :update, id: @activity_session.uid
      end

      it 'responds with 200' do
        expect(response.status).to eq(200)
      end

      it 'responds with the updated activity session' do
        expect(@parsed_body['activity_session']['uid']).to eq(@activity_session.uid)
      end

    end

    context 'concept results are included' do

      def subject
        @writing_concept = create(:concept, name: 'Creative Writing')
        results = [
          create(:concept_result, metadata: {
              foo: 'bar',
            }, activity_session_id: @activity_session.id, concept: @writing_concept
          ),
          create(:concept_result, metadata: {
              baz: 'foo',
            }, activity_session_id: @activity_session.id
          ),
          create(:concept_result,
            activity_session_id: @activity_session.id
          )
        ]
        put :update, id: @activity_session.uid, concept_results:  JSON.parse(results.to_json)
      end

      it 'succeeds' do
        subject
        expect(response.status).to eq(200)
      end

      it 'stores the concept results' do
        subject
        @activity_session.reload
        expect(@activity_session.concept_results.size).to eq(4)
      end

      it 'saves the arbitrary metadata for the results' do
        subject
        @activity_session.reload
        expect(@activity_session.concept_results.find{|x| x.metadata == {"foo"=>"bar"}}).to be
      end

      it 'saves the concept tag relationship (ID) in the result' do
        subject
        expect(ConceptResult.where(activity_session_id: @activity_session, concept_id: @writing_concept.id).count).to eq(1)
      end
    end

    context 'result is assigned to a non-existent concept tag' do
      def subject
        results = [
          {
            concept_uid: 'Non-existent UID',
            metadata: {
              foo: 'bar',
            }
          }
        ]
        put :update, id: @activity_session.uid, concept_results: results
      end

      # this is no longer the case, as results should not be saved with nonexistent concept tag
      it 'does not save the concept result' do
        @activity_session.concept_results.destroy_all
        response = subject
        expect(@activity_session.concept_results).to eq([])
      end
    end
  end

  describe '#update_comprehension_session' do
    let(:token) { double :acceptable? => true, resource_owner_id: user.id }
    let(:user) { create(:student) }

    before do
      allow(controller).to receive(:doorkeeper_token) {token}
      @activity_session = create(:activity_session, state: 'started', user: user, completed_at: nil)
    end

    it 'passes activity session and user to notifier service' do
      service_instance = double(:service_instance)

      expect(NotifyOfCompletedActivity).to receive(:new)
        .with(@activity_session)
        .and_return(service_instance)
      expect(service_instance).to receive(:call)

      post :update_comprehension_session, id: @activity_session.uid, state: 'finished'
    end

    context 'default behavior' do
      include_context "calling the api"

      before do
        subject
        @parsed_body = JSON.parse(response.body)
      end

      def subject
        # FIXME: URL Parameter should be called uid, not id, because that is confusing
        put :update_comprehension_session, id: @activity_session.uid
      end

      it 'responds with 200' do
        expect(response.status).to eq(200)
      end

      it 'responds with the updated activity session' do
        expect(@parsed_body['activity_session']['uid']).to eq(@activity_session.uid)
      end

    end

  end

  describe '#show' do
    let!(:session) { create(:activity_session) }

    it 'renders the correct json' do
      get :show, id: session.uid
      expect(JSON.parse(response.body)["meta"]).to eq({
          "status" => "success",
          "message" => nil,
          "errors" => nil
        })
      expect(JSON.parse(response.body)["activity_session"]["uid"]).to eq session.uid
      expect(JSON.parse(response.body)["activity_session"]["percentage"]).to eq session.percentage
      expect(JSON.parse(response.body)["activity_session"]["state"]).to eq session.state
      expect(JSON.parse(response.body)["activity_session"]["data"]).to eq session.data
      expect(JSON.parse(response.body)["activity_session"]["temporary"]).to eq session.temporary
      expect(JSON.parse(response.body)["activity_session"]["activity_uid"]).to eq session.activity_uid
      expect(JSON.parse(response.body)["activity_session"]["anonymous"]).to eq session.anonymous
    end
  end

  describe '#create' do
    let(:classroom_unit) { create(:classroom_unit) }
    let(:session) { create(:proofreader_activity_session, classroom_unit: classroom_unit) }

    it 'creates the activity session' do
      put :create, params: session.attributes.except(:id, :completed_at, :user_id, :created_at, :updated_at), format: :json
      expect(JSON.parse(response.body)["meta"]).to eq({
        "status" => "success",
        "message" => "Activity Session Created",
        "errors" => {}
      })
    end
  end

  describe '#destoy' do
    include_context "calling the api" #bypass doorkeeper
    let!(:session) { create(:proofreader_activity_session) }

    it 'destroys the activity session' do
      delete :destroy, id: session.uid, format: :json
      expect(JSON.parse(response.body)["meta"]).to eq({
        "status" => "success",
        "message" => "Activity Session Destroy Successful",
        "errors" => nil
      })
    end
  end
end
