require 'rails_helper'

describe Cms::TopicCategoriesController do
  it { should use_before_action :set_topic_category }

  let!(:user) { create(:staff) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    let!(:category) { create(:topic_category) }

    it 'should assign the topic categories' do
      get :index
      expect(assigns(:topic_categories)).to include category
    end
  end

  describe '#create' do
    it 'should create the topic category with the params given' do
      post :create, topic_category: { name: "new name" }
      expect(response).to redirect_to cms_topic_categories_url
      expect(TopicCategory.last.name).to eq "new name"
    end
  end

  describe '#update' do
    let!(:category) { create(:topic_category) }

    it 'should update the given topic category' do
      post :update, id: category.id, topic_category: { name: "updated name" }
      expect(category.reload.name).to eq "updated name"
      expect(response).to redirect_to cms_topic_categories_path
    end
  end

  describe '#destroy' do
    let!(:category) { create(:topic_category) }

    it 'should destroy the given topic category' do
      delete :destroy, id: category.id
      expect{TopicCategory.find(category.id)}.to raise_exception ActiveRecord::RecordNotFound
    end
  end
end