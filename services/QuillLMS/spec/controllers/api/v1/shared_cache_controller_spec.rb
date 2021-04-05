require 'json'
require 'rails_helper'

describe Api::V1::SharedCacheController, type: :controller do
  KEY = "test_shared_cache_key"
  COMBINED_KEY = "#{Api::V1::SharedCacheController::BASE_SHARED_CACHE_KEY}_#{KEY}"

  describe "#show" do
    it "should return a 404 if the custom cache key isn't set" do
      expect($redis).to receive(:get).with(COMBINED_KEY).and_return(nil)
      get :show, params: { id: KEY }
      expect(response.status).to eq(404)
      expect(response.body).to include("The resource you were looking for does not exist")
    end

    it "should return the data in the cache if it is set" do
      CACHED_DATA = {
        foo: 'bar'
      }
      expect($redis).to receive(:get).with(COMBINED_KEY).and_return(CACHED_DATA.to_json)
      get :show, params: { id: KEY, data: CACHED_DATA }
      expect(response.status).to eq(200)
      expect(response.body).to eq(CACHED_DATA.to_json)
    end
  end

  describe "#update" do
    it "should set the cache for the specified key" do
      SET_DATA = {"foo" => "bar"}
      expect($redis).to receive(:set).with(COMBINED_KEY, SET_DATA.to_json, {ex: Api::V1::SharedCacheController::SHARED_CACHE_EXPIRY})
      put :update, params: { id: KEY, data: SET_DATA }
      expect(response.status).to eq(200)
      expect(response.body).to eq(SET_DATA.to_json)
    end
  end

  describe "#destroy" do
    it "should delete the existing record" do
      expect($redis).to receive(:del).with(COMBINED_KEY)
      delete :destroy, params: { id: KEY }
      expect(response.status).to eq(200)
      expect(response.body).to eq("OK")
    end
  end
end
