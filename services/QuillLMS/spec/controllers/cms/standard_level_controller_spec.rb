require 'rails_helper'

describe Cms::StandardLevelsController do
  it { should use_before_action :set_standard_level }

  let(:user) { create(:staff) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    let!(:standard_level) { create(:standard_level) }

    it 'should assing the standard_levels' do
      get :index
      expect(assigns(:standard_levels)).to include standard_level
    end
  end

  describe '#create' do
    it 'should create the standard_level with the params given' do
      post :create, standard_level: { name: "test", position: 2 }
      expect(StandardLevel.last.name).to eq "test"
      expect(StandardLevel.last.position).to eq 2
      expect(response).to redirect_to cms_standard_levels_url
    end
  end

  describe '#update' do
    let!(:standard_level) { create(:standard_level) }

    it 'should update the given standard_level' do
      post :update, id: standard_level.id, standard_level: { name: "new name" }
      expect(standard_level.reload.name).to eq "new name"
    end
  end

  describe '#destroy' do
    let!(:standard_level) { create(:standard_level) }

    it 'should destroy the given standard_level' do
      delete :destroy, id: standard_level.id
      expect{StandardLevel.find(standard_level.id)}.to raise_exception ActiveRecord::RecordNotFound
      expect(response).to redirect_to cms_standard_levels_url
    end
  end
end
