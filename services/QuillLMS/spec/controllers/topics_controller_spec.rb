# frozen_string_literal: true

require 'rails_helper'

describe TopicsController do
  let!(:topic) { create(:topic) }
  let!(:level_two_topic) { create(:topic, level: 2) }
  let!(:level_three_topic) { create(:topic, level: 3) }

  describe '#index' do
    it 'should return all the topics' do
      get :index
      parsed_response = JSON.parse(response.body)
      topic_results = parsed_response["topics"]
      Topic.all.each do |t|
        expect(topic_results.find { |tr| tr["id"] == t.id }).to be
      end
      expect(topic_results.size).to eq(Topic.count)
    end
  end

end
