require 'rails_helper'

describe Cms::StandardCategoriesController do
  it { should use_before_action :set_standard_category }

  let!(:user) { create(:staff) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    let!(:category) { create(:standard_category) }

    it 'should assign the standard categories' do
      get :index
      expect(assigns(:standard_categories)).to include category
    end
  end

  describe '#create' do
    it 'should create the standard category with the params given' do
      post :create, standard_category: { name: "new name" }
      expect(response).to redirect_to cms_standard_categories_url
      expect(StandardCategory.last.name).to eq "new name"
    end
  end

  describe '#update' do
    let!(:category) { create(:standard_category) }

    it 'should update the given standard category' do
      post :update, id: category.id, standard_category: { name: "updated name" }
      expect(category.reload.name).to eq "updated name"
      expect(response).to redirect_to cms_standard_categories_path
    end
  end

  describe '#destroy' do
    let!(:category) { create(:standard_category) }

    it 'should destroy the given standard category' do
      delete :destroy, id: category.id
      expect{StandardCategory.find(category.id)}.to raise_exception ActiveRecord::RecordNotFound
    end
  end
end
