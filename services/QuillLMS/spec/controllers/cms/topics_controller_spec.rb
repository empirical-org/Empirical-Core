require 'rails_helper'

describe Cms::TopicsController do
  it { should use_before_action :set_topic }

  let(:user) { create(:staff) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    let!(:topic) { create(:topic) }
    let!(:topic1) { create(:topic) }

    it 'sould give all the topics' do
      get :index
      expect(assigns(:topics)).to include topic
      expect(assigns(:topics)).to include topic1
    end
  end

  describe '#edit' do
    let!(:topic) { create(:topic) }

    it 'should find the topic' do
      get :edit, id: topic.id
      expect(assigns(:topic)).to eq topic
    end
  end

  describe '#create' do
    let(:topic) { build(:topic) }

    it 'should create the topic with the given params' do
      post :create, topic: topic.attributes
      expect(Topic.last.name).to eq topic.name
      expect(Topic.last.topic_category_id).to eq topic.topic_category_id
      expect(Topic.last.section_id).to eq topic.section_id
    end
  end

  describe '#update' do
    let!(:topic) { create(:topic) }
    
    it 'should update the given topic' do
      post :update, id: topic.id, topic: { name: "new name" }
      expect(topic.reload.name).to eq "new name"
    end
  end

  describe '#destroy' do
    let!(:topic) { create(:topic) }

    it 'should destroy the given topic' do
      delete :destroy, id: topic.id
      expect{ Topic.find topic.id }.to raise_exception ActiveRecord::RecordNotFound
    end
  end
end