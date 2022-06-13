# frozen_string_literal: true

require 'rails_helper'

describe Cms::RecommendationsController do
  let(:user) { create(:staff) }

  before { allow(controller).to receive(:current_user) { user } }

  it { should use_before_action :set_activity_classification }
  it { should use_before_action :set_activity }
  it { should use_before_action :set_unit_templates }

  describe '#index' do
    let(:recommendations) { double(:recommendations) }
    let(:independent_recommendations) { double(:independent_recommendations) }
    let(:group_recommendations) { double(:group_recommendations) }
    let!(:activity) { create(:activity) }
    let!(:activity_classification) { create(:activity_classification) }

    before do
      allow(Recommendation).to receive(:includes) { double(:query, where: recommendations) }
      allow(Recommendation).to receive(:independent_practice) { double(:query1, where: independent_recommendations) }
      allow(Recommendation).to receive(:group_lesson) { double(:query2, where: group_recommendations) }
    end

    it 'should assign the normal, independent, and group recommendations' do
      get :index, params: { activity_classification_id: activity_classification.id, activity_id: activity.id }
      expect(assigns(:recommendations)).to eq recommendations
      expect(assigns(:independent_recommendations)).to eq independent_recommendations
      expect(assigns(:group_recommendations)).to eq group_recommendations
    end
  end

  describe '#new' do
    let(:recommendation) { double(:recommendation) }
    let!(:concept) { create(:concept) }
    let!(:unit_template) { create(:unit_template) }
    let!(:activity) { create(:activity) }
    let!(:activity_classification) { create(:activity_classification) }

    before { allow(Recommendation).to receive(:new) { recommendation } }

    it 'should assign the concepts and recommendation' do
      get :new, params: { activity_classification_id: activity_classification.id, activity_id: activity.id }
      expect(assigns(:concepts)).to eq [concept]
      expect(assigns(:recommendation)).to eq recommendation
      expect(assigns(:unit_templates)).to eq [unit_template]
    end
  end

  describe '#show' do
    let!(:activity) { create(:activity) }
    let!(:activity_classification) { create(:activity_classification) }
    let!(:recommendation) { create(:recommendation) }

    it 'should find the recommendation' do
      get :show, params: { id: recommendation.id, activity_id: activity.id, activity_classification_id: activity_classification.id }
      expect(assigns(:recommendation)).to eq recommendation
    end
  end

  describe '#create' do
    let!(:activity) { create(:activity) }
    let!(:activity_classification) { create(:activity_classification) }
    let!(:unit_template) { create(:unit_template) }

    context 'when the activity has recommendations and recommendation has a category' do
      let!(:recommendation) { create(:recommendation, activity: activity, category: 0) }

      it 'should create the recommendation with the given activity and order number greater than that of the category' do
        post :create, params: { activity_id: activity.id, activity_classification_id: activity_classification.id, category: "independent_practice", recommendation: {
             name: "some_name",
             unit_template_id: unit_template.id,
             category: "independent_practice"
           } }
        expect(Recommendation.last.order).to eq recommendation.order + 1
        expect(Recommendation.last.activity).to eq activity
      end
    end


    it 'should create the recommendation with the given activity and next order number' do
      post :create, params: { activity_id: activity.id, activity_classification_id: activity_classification.id, category: "independent_practice", recommendation: {
               name: "some_name",
               unit_template_id: unit_template.id,
               category: "independent_practice"
           } }
      expect(Recommendation.last.order).to eq 0
      expect(Recommendation.last.activity).to eq activity
    end

    it 'should throw error if recommendation is not created' do
      post :create, params: { activity_id: activity.id, activity_classification_id: activity_classification.id, recommendation: {
               unit_template_id: unit_template.id,
               category: "independent_practice"
           } }
      expect(response).to render_template :new
      expect(flash[:error]).to eq "Unable to create recommendation."
    end
  end

  describe '#destroy' do
    let!(:activity) { create(:activity) }
    let!(:activity_classification) { create(:activity_classification) }
    let!(:recommendation) { create(:recommendation) }

    it 'should destroy the recommendation' do
      delete :destroy, params: { id: recommendation.id, activity_id: activity.id, activity_classification_id: activity_classification.id }
      expect{ Recommendation.find(recommendation.id) }.to raise_exception ActiveRecord::RecordNotFound
    end
  end
end
