require 'rails_helper'

describe FactoriesController do
  describe '#create' do
    before do
      allow(FactoryBot).to receive(:create) { {factory: "json"} }
    end

    it 'should create the factory amd give it' do
      post :create, factory: "some factory"
      expect(response.body).to eq({factory: "json"}.to_json)
    end
  end

  describe '#create_list' do
    before do
      allow(FactoryBot).to receive(:create_list) { {list: "some list"} }
    end

    it 'should create the list' do
      get :create_list, factory: "some factory"
      expect(response.body).to eq({list: "some list"}.to_json)
    end
  endg
end