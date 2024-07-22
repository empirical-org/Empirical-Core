# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::ConceptFeedbackController, type: :controller do
  let!(:concept_feedback) { create(:concept_feedback) }

  describe '#index' do
    it 'should return a list of ConceptFeedbacks' do
      get :index, params: { activity_type: concept_feedback.activity_type }, as: :json
      expect(JSON.parse(response.body).keys.length).to eq(1)
    end

    it 'should include the response from the db' do
      get :index, params: { activity_type: concept_feedback.activity_type }, as: :json
      expect(JSON.parse(response.body).keys.first).to eq(concept_feedback.uid)
    end

    it 'resets the redis cache for all concept feedbacks if not set already' do
      $redis.del(concept_feedback.cache_key)
      get :index, params: { activity_type: concept_feedback.activity_type }, as: :json
      expect(JSON.parse(response.body)).to eq(
        ConceptFeedback
          .where(activity_type: concept_feedback.activity_type)
          .all
          .reduce({}) { |agg, q| agg.update({q.uid => q.as_json}) }
      )
    end

  end

  describe "#translations" do
    let(:locale) { Translatable::DEFAULT_LOCALE }
    let!(:concept_feedback_untranslated) { create(:concept_feedback)}

    context 'there is a translation available for the language' do
      let!(:concept_feedback1) { create(:concept_feedback, :with_translated_text)}
      let!(:concept_feedback2) { create(:concept_feedback, :with_translated_text)}
      let(:cache_key) {
        ConceptFeedback::ALL_CONCEPT_FEEDBACKS_KEY + "_" +
        concept_feedback1.activity_type + "_" +
        locale
      }

      context 'there is no cache set' do
        before do
          $redis.del(cache_key)
        end

        it 'returns all the concept feedback translated fields for that language' do
          get :translations, params: {
              locale:,
              activity_type: concept_feedback1.activity_type
          }, as: :json
          body = JSON.parse(response.body)
          expect(body[concept_feedback1.uid]['description']).to eq(concept_feedback1.translation(locale:))
          expect(body[concept_feedback2.uid]['description']).to eq(concept_feedback2.translation(locale:))
          expect(body.keys).not_to include(concept_feedback_untranslated.uid)
        end

        it 'sets the redis cache' do
          get :translations, params: {
              locale:,
              activity_type: concept_feedback1.activity_type
          }, as: :json
          expect($redis.get(cache_key)).to eq(response.body)
        end
      end

      context 'the cache is set' do
        let(:cache_value) { {foo: 'bar'}.to_json }

        it 'returns the cache value' do
          $redis.set(cache_key, cache_value)
          get :translations, params: {
              locale:,
              activity_type: concept_feedback1.activity_type
          }, as: :json
          expect(response.body).to eq(cache_value)
        end
      end
    end

    context 'there is no translation for that language' do
      it 'returns an empty hash' do
        get :translations, params: {
            locale:,
            activity_type: concept_feedback_untranslated.activity_type
        }, as: :json
        body = JSON.parse(response.body)
        expect(body).to eq({})
      end
    end

  end

  describe '#show' do
    it 'should return the specified concept_feedback' do
      get :show, params: { activity_type: concept_feedback.activity_type, id: concept_feedback.uid }, as: :json
      expect(JSON.parse(response.body)).to eq(concept_feedback.data)
    end

    it 'should return a 404 if the requested ConceptFeedback is not found' do
      get :show, params: { activity_type: concept_feedback.activity_type, id: 'doesnotexist' }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include('The resource you were looking for does not exist')
    end
  end

  describe '#create' do
    it 'should create a new ConceptFeedback record' do
      uuid = SecureRandom.uuid
      data = {foo: 'bar'}
      expect(SecureRandom).to receive(:uuid).and_return(uuid)
      pre_create_count = ConceptFeedback.count
      post :create, params: { activity_type: concept_feedback.activity_type, concept_feedback: data }, as: :json
      expect(ConceptFeedback.count).to eq(pre_create_count + 1)
    end

    it 'should expire the redis cache for concept feedbacks with that activity type' do
      expect($redis).to receive(:del).with(concept_feedback.cache_key)
      post :create, params: { activity_type: concept_feedback.activity_type, concept_feedback: {foo: 'bar'} }, as: :json
    end
  end

  describe '#update' do
    it 'should update the existing record' do
      data = {'foo' => 'bar'}
      put :update,
        params: {
          activity_type: concept_feedback.activity_type,
          id: concept_feedback.uid,
          concept_feedback: data
        },
        as: :json

      concept_feedback.reload
      expect(concept_feedback.data).to eq(data)
    end

    it "should create a new record with the specified UID if one doesn't exit" do
      data = {'foo' => 'bar'}
      uid = SecureRandom.uuid
      expect(ConceptFeedback.find_by(uid: uid)).to be_nil
      put :update,
        params: {
          activity_type: concept_feedback.activity_type,
          id: uid,
          concept_feedback: data
        },
        as: :json

      expect(ConceptFeedback.find_by(uid: uid)).to be
    end

    it 'should expire the redis cache for concept feedbacks with that activity type' do
      expect($redis).to receive(:del).with(concept_feedback.cache_key)
      data = {'foo' => 'bar'}
      put :update,
        params: {
          activity_type: concept_feedback.activity_type,
          id: concept_feedback.uid,
          concept_feedback: data
        },
        as: :json
    end
  end
end
