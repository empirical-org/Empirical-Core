require 'rails_helper'

describe Cms::CriteriaController do
  it { should use_before_action :set_activity }
  it { should use_before_action :set_recommendation }
  it { should use_before_action :set_activity_classification }
  it { should use_before_action :set_criterion }

  let(:user) { create(:staff) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#new' do
    let!(:activity_classification) { create(:activity_classification) }
    let!(:activity) { create(:activity) }
    let!(:recommendation) { create(:recommendation) }
    let(:criteria) { double(:criteria) }

    before do
      allow(Criterion).to receive(:new) { criteria }
    end
  
    it 'should give a new criteria' do
      get :new, 
        activity_classification_id: activity_classification.id,
        activity_id: activity.id, 
        recommendation_id: recommendation.id
      expect(assigns(:criterion)).to eq criteria
    end
  end

  describe '#create' do
    let!(:activity_classification) { create(:activity_classification) }
    let!(:activity) { create(:activity) }
    let!(:recommendation) { create(:recommendation) }
    let!(:concept) { create(:concept) }

    it 'should create the criteria with the given params' do
      post :create, criterion: {
        concept_id: concept.id, 
        count: 1, 
        no_incorrect: 2 
      },
      activity_classification_id: activity_classification.id,
      activity_id: activity.id, 
      recommendation_id: recommendation.id

      expect(response).to redirect_to cms_activity_classification_activity_recommendation_path(
        activity_classification,
        activity,
        recommendation
      )
      expect(flash[:notice]).to eq "Criterion created!"
    end
  end

  describe '#update' do
    let!(:activity_classification) { create(:activity_classification) }
    let!(:activity) { create(:activity) }
    let!(:recommendation) { create(:recommendation) }
    let(:concept) { create(:concept) }
    let(:criterion) { create(:criterion, concept: concept, count: 1, no_incorrect: 2) }

    it 'should update the given criterion' do
      post :update, 
        activity_classification_id: activity_classification.id,
        activity_id: activity.id, 
        recommendation_id: recommendation.id,
        id: criterion.id,
        criterion: { count: 2 }
      expect(response).to redirect_to cms_activity_classification_activity_recommendation_path(
        activity_classification,
        activity,
        recommendation
      )
      expect(flash[:notice]).to eq "Criterion updated!"
      expect(criterion.reload.count).to eq 2
    end
  end

  describe '#destroy' do
    let!(:activity_classification) { create(:activity_classification) }
    let!(:activity) { create(:activity) }
    let!(:recommendation) { create(:recommendation) }
    let(:concept) { create(:concept) }
    let(:criterion) { create(:criterion, concept: concept, count: 1, no_incorrect: 2) }


    it 'should destroy the given criterion' do
      delete :destroy, 
        activity_classification_id: activity_classification.id,
        activity_id: activity.id, 
        recommendation_id: recommendation.id,
        id: criterion.id
      expect{ Criterion.find(criterion.id) }.to raise_exception ActiveRecord::RecordNotFound
    end
  end
end