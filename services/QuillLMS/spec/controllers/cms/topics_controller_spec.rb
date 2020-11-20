require 'rails_helper'

describe Cms::TopicsController do
  let!(:user) { create(:staff) }
  let!(:raw_scores) { create_list(:raw_score, 10, :with_change_log) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    it 'returns a json hash with all the topics and change logs' do
      get :index
      parsed_response = JSON.parse(response.body)
      topic_results = parsed_response["topics"]
      change_log_results = parsed_response["change_logs"]
      topics.each do |t|
        expect(topic_results.find { |tr| tr["id"] == t.id }).to be
        expect(change_log_results.find { |cl| cl["id"] == t.change_logs[0].id}).to be
      end
    end
  end

  describe '#create' do
    it 'creates a new topic with the nested change logs' do
      post :create, {
        topic: {
          name: 'New Topic',
          level: 3,
          visible: true,
          change_logs_attributes: [
            {
              action: 'Created',
              changed_record_type: 'Topic',
              explanation: 'Here is an explanation'
            }
          ]
        }
      }
      parsed_response = JSON.parse(response.body)
      id = parsed_response["topic"]["id"]
      expect(id).to be
      expect(Topic.find_by_id(id)).to be
      expect(ChangeLog.find_by(changed_record_id: id, changed_record_type: 'Topic', action: 'Created')).to be
    end
  end

  describe '#update' do
    it 'creates a new topic with the nested change logs' do
      new_name = 'New Topic Name'
      id = topics[0].id
      put :update, {
        id: id,
        topic: {
          name: new_name,
          id: id,
          change_logs_attributes: [
            {
              action: 'Renamed',
              changed_record_type: 'Topic',
              changed_record_id: id,
              explanation: 'Here is an explanation'
            }
          ]
        }
      }
      expect(Topic.find_by_id(id).name).to eq(new_name)
      expect(ChangeLog.find_by(changed_record_id: id, changed_record_type: 'Topic', action: 'Renamed')).to be
    end
  end
end
