require 'rails_helper'

describe Cms::ActivityCategoriesController, type: :controller do
  it { should use_before_filter :set_activity_category }

  let(:user) { create(:staff) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    let!(:category) { create(:activity_category) }
    let!(:category1) { create(:activity_category) }

    it 'should give all the categories' do
      get :index
      expect(assigns(:activity_categories)).to include(category, category1)
    end
  end

  describe '#show' do
    let!(:category) { create(:activity_category) }

    before do
      allow_any_instance_of(GetActivitiesQuery).to receive(:run) { "activities" }
    end

    it 'should fetch the category and activityes' do
      get :show, id: category.id
      expect(assigns(:activity_category)).to eq category
      expect(assigns(:activities)).to eq "activities"
    end
  end

  describe '#update_order_numbers' do
    let!(:category) { create(:activity_category) }
    let!(:category1) { create(:activity_category) }

    it 'should update the order number in the categories given and return all the categories' do
      put :update_order_numbers, activity_categories: [{id: category.id, order_number: 42}, {id: category1.id, order_number: 24}]
      expect(category.reload.order_number).to eq 42
      expect(category1.reload.order_number).to eq 24
      expect(response.body).to eq({
        activity_categories: ActivityCategory.order(order_number: :asc)
      }.to_json)
    end
  end

  describe '#destroy_and_recreate_acas' do
    let(:category) { create(:activity_category) }
    let(:activites) { double(:activities, destroy_all: true) }
    let(:found_record) { double(:records, activity_category_activities: activites) }

    before do
      allow(ActivityCategory).to receive(:find) { found_record }
      allow_any_instance_of(GetActivitiesQuery).to receive(:run) { "activities" }
    end

    it 'should destroy the old category and recreate new category activity with the same id and order number' do
      expect(activites).to receive(:destroy_all)
      post :destroy_and_recreate_acas, activities: [{id: 24, order_number: 2}], activity_category_id: category.id
      expect(ActivityCategoryActivity.last.activity_id).to eq 24
      expect(ActivityCategoryActivity.last.order_number).to eq 2
      expect(ActivityCategoryActivity.last.activity_category_id).to eq category.id
      expect(response.body).to eq({
        activities: "activities"
      }.to_json)
    end
  end

  describe '#create' do
    it 'should create the activity category with the params' do
      post :create, activity_category: { name: "test", order_number: 2 }
      expect(ActivityCategory.last.name).to eq "test"
      expect(ActivityCategory.last.order_number).to eq 2
      expect(response).to redirect_to cms_activity_categories_path
    end
  end

  describe '#destroy' do
    let!(:category) { create(:activity_category) }

    it 'should destroy the given category' do
      delete :destroy, id: category.id
      expect{ActivityCategory.find(category.id)}.to raise_exception(ActiveRecord::RecordNotFound)
      expect(response.body).to eq({}.to_json)
    end
  end
end