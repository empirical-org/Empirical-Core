require 'rails_helper'

describe Cms::StandardLevelsController do
  let!(:user) { create(:staff) }
  let!(:standard_levels) { create_list(:standard_level, 10, :with_change_log) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    it 'returns a json hash with all the standard_levels and change logs' do
      get :index
      parsed_response = JSON.parse(response.body)
      standard_results = parsed_response["standard_levels"]
      change_log_results = parsed_response["change_logs"]
      standard_levels.each do |t|
        expect(standard_results.find { |tr| tr["id"] == t.id }).to be
        expect(change_log_results.find { |cl| cl["id"] == t.change_logs[0].id}).to be
      end
    end
  end

  describe '#create' do
    it 'creates a new standard with the nested change logs' do
      post :create, {
        standard_level: {
          name: 'New StandardLevel',
          level: 3,
          visible: true,
          change_logs_attributes: [
            {
              action: 'Created',
              changed_record_type: 'StandardLevel',
              explanation: 'Here is an explanation'
            }
          ]
        }
      }
      parsed_response = JSON.parse(response.body)
      id = parsed_response["standard_level"]["id"]
      expect(id).to be
      expect(StandardLevel.find_by_id(id)).to be
      expect(ChangeLog.find_by(changed_record_id: id, changed_record_type: 'StandardLevel', action: 'Created')).to be
    end
  end

  describe '#update' do
    it 'creates a new standard with the nested change logs' do
      new_name = 'New StandardLevel Name'
      id = standard_levels[0].id
      put :update, {
        id: id,
        standard_level: {
          name: new_name,
          id: id,
          change_logs_attributes: [
            {
              action: 'Renamed',
              changed_record_type: 'StandardLevel',
              changed_record_id: id,
              explanation: 'Here is an explanation'
            }
          ]
        }
      }
      expect(StandardLevel.find_by_id(id).name).to eq(new_name)
      expect(ChangeLog.find_by(changed_record_id: id, changed_record_type: 'StandardLevel', action: 'Renamed')).to be
    end
  end
end
