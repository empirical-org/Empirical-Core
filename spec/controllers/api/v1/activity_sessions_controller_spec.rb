require 'rails_helper'

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
        @writing_category = FactoryGirl.create(:concept_class, name: 'Writing Concepts')
        @sports_category = FactoryGirl.create(:concept_class, name: 'Sporting Events')
        @writing_tag = FactoryGirl.create(:concept_tag, name: 'Creative Writing', concept_class: @writing_category)
        @climbing_tag = FactoryGirl.create(:concept_tag, name: 'Competitive Ice-climbing', concept_class: @sports_category)
      end

      def subject
        results = [
          {
            concept_class: 'Writing Concepts',
            concept_tag: 'Creative Writing',
            foo: 'bar',
          },
          {
            concept_class: 'Sporting Events',
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

    context 'when the concept tag name is ambiguous (belongs to multiple categories)' do
      before do
        @activity_session = FactoryGirl.create(:activity_session)
        @writing_category = FactoryGirl.create(:concept_class, name: 'Writing Concepts')
        @grammar_category = FactoryGirl.create(:concept_class, name: 'Grammar Concepts')
        @writing_tag = FactoryGirl.create(:concept_tag, name: 'Their', concept_class: @writing_category)
        @grammar_tag = FactoryGirl.create(:concept_tag, name: 'Their', concept_class: @grammar_category)
      end

      def subject
        results = [
          {
            concept_class: 'Grammar Concepts',
            concept_tag: 'Their',
            baz: 'foo'
          },
          {
            concept_class: 'Writing Concepts',
            concept_tag: 'Their',
            foo: 'bar',
          }
        ]
        put :update, id: @activity_session.uid, concept_tag_results: results
      end

      it 'stores the right concept tag for the given concept tag category' do
        subject
        @activity_session.reload
        expect(@activity_session.concept_tag_results[0].concept_tag_id).to eq(@grammar_tag.id)
        expect(@activity_session.concept_tag_results[1].concept_tag_id).to eq(@writing_tag.id)
      end
    end

    context 'when a result is assigned to a non-existent concept tag' do
      before do
        @activity_session = FactoryGirl.create(:activity_session)
        @writing_category = FactoryGirl.create(:concept_class, name: 'Writing Concepts')
      end

      def subject
        results = [
          {
            concept_class: 'Writing Concepts',
            concept_tag: 'Non-existent tag',
            foo: 'bar',
          }
        ]
        put :update, id: @activity_session.uid, concept_tag_results: results
      end

      it 'raises a 422 (Unprocessable Entity) status code' do
        response = subject
        expect(response.status).to eq(422)
      end
    end
  end
end
