require 'rails_helper'

describe Api::V1::ActivitySessionsController, type: :controller do


  context 'PUT #update' do
    let(:token) { double :acceptable? => true, resource_owner_id: user.id }
    let(:user) { FactoryGirl.create(:student) }

    before do
      allow(controller).to receive(:doorkeeper_token) {token}
      @activity_session = FactoryGirl.create(:activity_session, user: user)
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

    context 'when concept results are included' do
      before do
        @writing_concept = FactoryGirl.create(:concept, name: 'Creative Writing')
        @climbing_concept = FactoryGirl.create(:concept, name: 'Competitive Ice-climbing')
        @pie_fighting_concept = FactoryGirl.create(:concept, name: 'Ultimate Pie Fighting')
      end

      def subject
        results = [
          {
            concept_uid: @writing_concept.uid,
            metadata: {
              foo: 'bar',
            },
          },
          {
            concept_uid: @climbing_concept.uid,
            metadata: {
              baz: 'foo'
            }
          },
          {
            concept_uid: @pie_fighting_concept.uid
          }
        ]
        put :update, id: @activity_session.uid, concept_results: results
      end

      it 'succeeds' do
        subject
        expect(response.status).to eq(200)
      end

      it 'stores the concept results' do
        subject
        @activity_session.reload
        expect(@activity_session.concept_results.size).to eq(3)
      end

      it 'saves the arbitrary metadata for the results' do
        subject
        @activity_session.reload
        expect(@activity_session.concept_results.first.metadata).to eq({'foo' => 'bar'})
      end

      it 'saves the concept tag relationship (ID) in the result' do
        subject
        @activity_session.reload
        expect(@activity_session.concept_results.first.concept.id).to eq(@writing_concept.id)
      end
    end

    context 'when a result is assigned to a non-existent concept tag' do
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
        response = subject
        expect(@activity_session.concept_results).to eq([])
      end
    end
  end
end
