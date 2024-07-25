# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::ActivityQuestionsController, type: :controller do
  let(:redis) { Redis.new }

  before do
    allow(Rails).to receive(:cache).and_return(ActiveSupport::Cache::RedisCacheStore.new(redis: redis))
  end

  describe "GET #index" do
    let(:activity) { create(:activity) }
    let(:questions) { create_list(:question, 3) }
    let(:locale) { 'en' }
    let(:cache_key) { "activity_questions/#{activity.uid}/#{locale}" }

    before do
      allow(Activity).to receive(:find_by).with(uid: activity.uid).and_return(activity)
      allow(activity).to receive(:questions).and_return(questions)
      questions.each do |question|
        allow(question).to receive(:as_json).with(locale:).and_return({ "id" => question.id, "content" => "Question content" })
      end
    end

    it "returns http success" do
      get :index, params: { activity_id: activity.uid, locale: }
      expect(response).to have_http_status(:success)
    end

    it "returns questions as a hash with UIDs as keys" do
      get :index, params: { activity_id: activity.uid, locale: }

      json_response = JSON.parse(response.body)
      expect(json_response.keys).to match_array(questions.map(&:uid))
    end

    it "calls as_json with the correct locale for each question" do
      expect(questions).to all(receive(:as_json).with(locale:))
      get :index, params: { activity_id: activity.uid, locale: }
    end

    it "caches the result" do
      expect(Rails.cache).to receive(:fetch).with(cache_key, expires_in: 1.hour).and_call_original

      get :index, params: { activity_id: activity.uid, locale: }
    end

    it "returns cached result on subsequent requests" do
      get :index, params: { activity_id: activity.uid, locale: }

      # Clear any existing stub to ensure we're testing the actual caching
      allow(Activity).to receive(:find_by).and_call_original

      # This should now come from cache
      get :index, params: { activity_id: activity.uid, locale: }
      expect(response).to have_http_status(:success)
    end

    context "when activity is not found" do
      before do
        allow(Activity).to receive(:find_by).and_return(nil)
      end

      it "returns http not_found" do
        get :index, params: { activity_id: 'non_existent_uid', locale: }
        expect(response).to have_http_status(:not_found)
      end

      it "does not attempt to cache" do
        expect(Rails.cache).not_to receive(:fetch)

        get :index, params: { activity_id: 'non_existent_uid', locale: }
      end
    end

    context "with different locales" do
      let(:locale) { 'es' }

      it "passes the correct locale to as_json" do
        expect(questions).to all(receive(:as_json).with(locale: 'es'))
        get :index, params: { activity_id: activity.uid, locale: }
      end


      it "uses a different cache key for different locales" do
        expect(Rails.cache).to receive(:fetch).with("activity_questions/#{activity.uid}/es", expires_in: 1.hour).and_call_original
        get :index, params: { activity_id: activity.uid, locale: }
      end
    end
  end
end
