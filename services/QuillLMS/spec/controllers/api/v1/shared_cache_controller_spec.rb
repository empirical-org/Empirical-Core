# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::SharedCacheController, type: :controller do
  let(:key) { 'test_shared_cache_key' }
  let(:combined_key) { "#{Api::V1::SharedCacheController::BASE_SHARED_CACHE_KEY}_#{key}" }

  describe "#show" do
    let(:cached_data) { {foo: 'bar'} }

    it "should return a 404 if the custom cache key isn't set" do
      expect(Rails.cache).to receive(:read).with(combined_key).and_return(nil)
      get :show, params: { id: key }, as: :json
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end

    it "should return the data in the cache if it is set" do
      expect(Rails.cache).to receive(:read).with(combined_key).and_return(cached_data.to_json)
      get :show, params: { id: key, data: cached_data }, as: :json
      expect(response.status).to eq(200)
      expect(response.body).to eq(cached_data.to_json)
    end
  end

  describe "#update" do
    let(:set_data) { {foo: 'bar'} }
    let(:expires_in) { Api::V1::SharedCacheController::SHARED_CACHE_EXPIRY }

    it "should set the cache for the specified key" do
      expect(Rails.cache).to receive(:write).with(combined_key, set_data.to_json, expires_in: expires_in)
      put :update, params: { id: key, data: set_data }, as: :json
      expect(response.status).to eq(200)
      expect(response.body).to eq(set_data.to_json)
    end
  end

  describe "#destroy" do
    it "should delete the existing record" do
      expect(Rails.cache).to receive(:delete).with(combined_key)
      delete :destroy, params: { id: key }, as: :json
      expect(response.status).to eq(200)
      expect(response.body).to eq("OK")
    end
  end
end
