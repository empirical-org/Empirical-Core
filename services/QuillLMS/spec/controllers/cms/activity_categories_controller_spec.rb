# frozen_string_literal: true

require 'rails_helper'

describe Cms::ActivityCategoriesController, type: :controller do
  let(:user) { create(:staff) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  around do |example|
    travel_to(Time.current) { example.run }
  end

  describe '#index' do
    let!(:category1) { create(:activity_category) }
    let!(:category2) { create(:activity_category) }

    it 'should give all the categories' do
      get :index
      category1_attributes = category1.attributes
      category1_attributes["activity_ids"] = []
      category2_attributes = category2.attributes
      category2_attributes["activity_ids"] = []
      expect(assigns(:activity_categories)).to include(category1_attributes, category2_attributes)
    end
  end

  describe '#mass_update' do
    let!(:activity_categories) { create_list(:activity_category, 3)}
    let!(:activity) { create(:activity)}

    it 'should update an activity category with changed attributes' do
      put :mass_update,
        params: {
          activity_categories: [
            {
              id: activity_categories[0].id,
              name: activity_categories[0].name,
              order_number: activity_categories[0].order_number,
              activity_ids: [activity.id]
            },
            {
              id: activity_categories[1].id,
              name: 'New Name',
              order_number: activity_categories[1].order_number,
              activity_ids: []
            }
          ]
        },
        as: :json

      expect(ActivityCategory.find(activity_categories[1].id).name).to eq('New Name')
    end

    it 'should create activity category activities for an activity category with activity_ids' do
      put :mass_update,
        params: {
          activity_categories: [
            {
              id: activity_categories[0].id,
              name: activity_categories[0].name,
              order_number: activity_categories[0].order_number,
              activity_ids: [activity.id]
            },
            {
              id: activity_categories[1].id,
              name: 'New Name',
              order_number: activity_categories[1].order_number,
              activity_ids: []
            }
          ]
        },
        as: :json

      expect(ActivityCategoryActivity.find_by(activity_category_id: activity_categories[0].id, activity_id: activity.id)).to be
    end

    it 'should destroy an activity category that is no longer on the list' do
      put :mass_update,
        params: {
          activity_categories: [
            {
              id: activity_categories[0].id,
              name: activity_categories[0].name,
              order_number: activity_categories[0].order_number,
              activity_ids: [activity.id]
            },
            {
              id: activity_categories[1].id,
              name: 'New Name',
              order_number: activity_categories[1].order_number,
              activity_ids: []
            }
          ]
        },
        as: :json

      expect(ActivityCategory.find_by(id: activity_categories[2].id)).not_to be
    end
  end

  describe '#create' do
    it 'should create the activity category with the params' do
      post :create, params: { activity_category: { name: "test", order_number: 2 } }
      expect(ActivityCategory.last.name).to eq "test"
      expect(ActivityCategory.last.order_number).to eq 2
    end
  end

end
