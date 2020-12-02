require 'rails_helper'

describe Cms::StandardsController do
  let!(:user) { create(:staff) }
  let!(:standard_category) { create(:standard_category) }
  let!(:standard_level) { create(:standard_level) }
  let!(:standards) { create_list(:standard, 10, :with_change_log) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    it 'returns a json hash with all the standards and change logs' do
      get :index
      parsed_response = JSON.parse(response.body)
      standard_results = parsed_response["standards"]
      change_log_results = parsed_response["change_logs"]
      standards.each do |t|
        expect(standard_results.find { |tr| tr["id"] == t.id }).to be
        expect(change_log_results.find { |cl| cl["id"] == t.change_logs[0].id}).to be
      end
    end
  end

  describe '#create' do
    it 'creates a new standard with the nested change logs' do
      post :create, {
        standard: {
          name: 'New Standard',
          level: 3,
          visible: true,
          standard_level_id: standard_level.id,
          standard_category_id: standard_category.id,
          change_logs_attributes: [
            {
              action: 'Created',
              changed_record_type: 'Standard',
              explanation: 'Here is an explanation'
            }
          ]
        }
      }
      parsed_response = JSON.parse(response.body)
      id = parsed_response["standard"]["id"]
      expect(id).to be
      expect(Standard.find_by_id(id)).to be
      expect(ChangeLog.find_by(changed_record_id: id, changed_record_type: 'Standard', action: 'Created')).to be
    end
  end

  describe '#update' do
    it 'creates a new standard with the nested change logs' do
      new_name = 'New Standard Name'
      id = standards[0].id
      put :update, {
        id: id,
        standard: {
          name: new_name,
          id: id,
          change_logs_attributes: [
            {
              action: 'Renamed',
              changed_record_type: 'Standard',
              changed_record_id: id,
              explanation: 'Here is an explanation'
            }
          ]
        }
      }
      expect(Standard.find_by_id(id).name).to eq(new_name)
      expect(ChangeLog.find_by(changed_record_id: id, changed_record_type: 'Standard', action: 'Renamed')).to be
    end
  end
end
