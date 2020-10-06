require 'rails_helper'

describe Cms::StandardsController do
  it { should use_before_action :set_standard }

  let(:user) { create(:staff) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    let!(:standard) { create(:standard) }
    let!(:standard1) { create(:standard) }

    it 'sould give all the standards' do
      get :index
      expect(assigns(:standards)).to include standard
      expect(assigns(:standards)).to include standard1
    end
  end

  describe '#edit' do
    let!(:standard) { create(:standard) }

    it 'should find the standard' do
      get :edit, id: standard.id
      expect(assigns(:standard)).to eq standard
    end
  end

  describe '#create' do
    let(:standard) { build(:standard) }

    it 'should create the standard with the given params' do
      post :create, standard: standard.attributes
      expect(Standard.last.name).to eq standard.name
      expect(Standard.last.standard_category_id).to eq standard.standard_category_id
      expect(Standard.last.standard_level_id).to eq standard.standard_level_id
    end
  end

  describe '#update' do
    let!(:standard) { create(:standard) }

    it 'should update the given standard' do
      post :update, id: standard.id, standard: { name: "new name" }
      expect(standard.reload.name).to eq "new name"
    end
  end

  describe '#destroy' do
    let!(:standard) { create(:standard) }

    it 'should destroy the given standard' do
      delete :destroy, id: standard.id
      expect{ Standard.find standard.id }.to raise_exception ActiveRecord::RecordNotFound
    end
  end
end
