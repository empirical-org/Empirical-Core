require 'rails_helper'

describe Cms::StandardCategoriesController do
  let!(:user) { create(:staff) }
  let!(:standard_categories) { create_list(:standard_category, 10, :with_change_log) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    it 'returns a json hash with all the standard_categories and change logs' do
      get :index
      parsed_response = JSON.parse(response.body)
      standard_results = parsed_response["standard_categories"]
      change_log_results = parsed_response["change_logs"]
      standard_categories.each do |t|
        expect(standard_results.find { |tr| tr["id"] == t.id }).to be
        expect(change_log_results.find { |cl| cl["id"] == t.change_logs[0].id}).to be
      end
    end
  end

  describe '#create' do
    it 'creates a new standard with the nested change logs' do
      post :create, {
        standard_category: {
          name: 'New StandardCategory',
          level: 3,
          visible: true,
          change_logs_attributes: [
            {
              action: 'Created',
              changed_record_type: 'StandardCategory',
              explanation: 'Here is an explanation'
            }
          ]
        }
      }
      parsed_response = JSON.parse(response.body)
      id = parsed_response["standard_category"]["id"]
      expect(id).to be
      expect(StandardCategory.find_by_id(id)).to be
      expect(ChangeLog.find_by(changed_record_id: id, changed_record_type: 'StandardCategory', action: 'Created')).to be
    end
  end

  describe '#update' do
    it 'creates a new standard with the nested change logs' do
      new_name = 'New StandardCategory Name'
      id = standard_categories[0].id
      put :update, {
        id: id,
        standard_category: {
          name: new_name,
          id: id,
          change_logs_attributes: [
            {
              action: 'Renamed',
              changed_record_type: 'StandardCategory',
              changed_record_id: id,
              explanation: 'Here is an explanation'
            }
          ]
        }
      }
      expect(StandardCategory.find_by_id(id).name).to eq(new_name)
      expect(ChangeLog.find_by(changed_record_id: id, changed_record_type: 'StandardCategory', action: 'Renamed')).to be
    end
  end
end
