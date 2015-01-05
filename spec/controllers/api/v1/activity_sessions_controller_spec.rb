require 'spec_helper'

describe Api::V1::ActivitySessionsController, :type => :controller do

  context 'PUT #update' do
    context 'default behavior' do
      include_context "calling the api"

      before do
        @activity_session = FactoryGirl.create(:activity_session)
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

    context 'when concept tag results are included' do
      before do
        @activity_session = FactoryGirl.create(:activity_session)
        @writing_tag = FactoryGirl.create(:concept_tag, name: 'Creative Writing')
        @climbing_tag = FactoryGirl.create(:concept_tag, name: 'Competitive Ice-climbing')
      end

      def subject
        results = [
          {
            concept_tag: 'Creative Writing',
            foo: 'bar',
          },
          {
            concept_tag: 'Competitive Ice-climbing',
            baz: 'foo'
          }
        ]
        put :update, id: @activity_session.uid, concept_tag_results: results
      end

      it 'stores the concept tag results' do
        subject
        @activity_session.reload
        expect(@activity_session.concept_tag_results.size).to eq(2)
      end

      it 'saves the arbitrary metadata for the results' do
        subject
        @activity_session.reload
        expect(@activity_session.concept_tag_results.first.metadata).to eq({'foo' => 'bar'})
      end

      it 'saves the concept tag relationship (ID) in the result' do
        subject
        @activity_session.reload
        expect(@activity_session.concept_tag_results.first.concept_tag.id).to eq(@writing_tag.id)
      end
    end

    context 'when a result is assigned to a non-existent concept tag' do
      
    end
  end
end
