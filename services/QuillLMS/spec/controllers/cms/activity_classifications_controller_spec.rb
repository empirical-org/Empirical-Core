require 'rails_helper'

describe Cms::ActivityClassificationsController, type: :controller do
  let(:user) { create(:staff) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    let!(:classification) { create(:activity_classification) }
    let!(:classification1) { create(:activity_classification) }

    it 'should return all the activity classifications' do
      get :index, format: :json
      expect(response.body).to eq({
        activity_classifications: ActivityClassification.order(order_number: :asc)
      }.to_json)
    end
  end

  describe '#create' do
    let(:classification) { build(:activity_classification) }

    it 'should create the activity classification with the given params' do
      post :create, activity_classification: classification.attributes
      expect(ActivityClassification.last.name).to eq classification.name
      expect(ActivityClassification.last.order_number).to eq classification.order_number
      expect(ActivityClassification.last.form_url).to eq classification.form_url
      expect(ActivityClassification.last.scored).to eq classification.scored
      expect(ActivityClassification.last.uid).to eq classification.uid
      expect(ActivityClassification.last.app_name).to eq classification.app_name
    end
  end

  describe '#update' do
    let!(:classification) { create(:activity_classification) }

    it 'should update the classification with the params provided' do
      classification.update(order_number: 19)
      put :update, id: classification.id, activity_classification: { id: classification.id, order_number: 20 }
      expect(classification.reload.order_number).to eq 20
    end
  end

  describe '#update_order_numbers' do
    let!(:classification) { create(:activity_classification) }

    it 'should update the classification with the params provided' do
      classification.update(order_number: 19)
      put :update_order_numbers, activity_classifications: [{ id: classification.id, order_number: 20 }]
      expect(classification.reload.order_number).to eq 20
      expect(response.body).to eq({activity_classifications: ActivityClassification.order(order_number: :asc)}.to_json)
    end
  end

  describe '#destroy' do
    let!(:classification) { create(:activity_classification) }

    it 'should destroy the given classification' do
      delete :destroy, id: classification.id
      expect{ActivityClassification.find(classification.id)}.to raise_exception(ActiveRecord::RecordNotFound)
    end
  end
end