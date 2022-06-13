# frozen_string_literal: true

require 'rails_helper'

describe Cms::RawScoresController do
  let!(:user) { create(:staff) }
  let!(:raw_scores) { create_list(:raw_score, 10, :four_hundred_to_five_hundred) }
  let!(:connect) { create(:activity_classification, key: ActivityClassification::CONNECT_KEY) }
  let!(:grammar) { create(:activity_classification, key: ActivityClassification::GRAMMAR_KEY) }
  let!(:proofreader) { create(:activity_classification, key: ActivityClassification::PROOFREADER_KEY) }
  let!(:lessons) { create(:activity_classification, key: ActivityClassification::LESSONS_KEY) }
  let!(:diagnostic) { create(:activity_classification, key: ActivityClassification::DIAGNOSTIC_KEY) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    it 'returns a json hash with all the raw_scores and the activity classification tables' do
      get :index
      parsed_response = JSON.parse(response.body)
      raw_score_results = parsed_response["raw_scores"]
      raw_scores.each do |t|
        expect(raw_score_results.find { |tr| tr["id"] == t.id }).to be
      end
    end
  end

  describe '#create' do
    it 'creates a new raw score' do
      post :create, params: { raw_score: {
          name: 'New Raw Score',
          order: 1
        } }
      parsed_response = JSON.parse(response.body)
      id = parsed_response["raw_score"]["id"]
      expect(id).to be
      expect(RawScore.find_by_id(id)).to be
    end
  end

  describe '#update' do
    it 'creates a new raw_score with the nested change logs' do
      new_name = 'New RawScore Name'
      id = raw_scores[0].id
      put :update, params: { id: id, raw_score: {
          name: new_name
        } }
      expect(RawScore.find_by_id(id).name).to eq(new_name)
    end
  end
end
