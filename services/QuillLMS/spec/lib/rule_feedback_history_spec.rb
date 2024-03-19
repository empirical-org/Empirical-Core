# frozen_string_literal: true

require 'rails_helper'

RSpec.describe RuleFeedbackHistory, type: :model do
  describe '#generate_rulewise_report' do
    it 'should render feedback histories' do
      so_rule1 = create(:evidence_rule, name: 'so_rule1', rule_type: 'autoML')
      unused_rule = create(:evidence_rule, name: 'unused', rule_type: 'autoML')

      f_h1 = create(:feedback_history, rule_uid: so_rule1.uid, prompt_id: 1)
      f_h2 = create(:feedback_history, rule_uid: so_rule1.uid, prompt_id: 1)
      f_h3 = create(:feedback_history, rule_uid: unused_rule.uid, prompt_id: 1)

      result = RuleFeedbackHistory.generate_rulewise_report(
        rule_uid: so_rule1.uid,
        prompt_id: 1,
        start_date: nil,
        end_date: nil)

      expect(result.keys.length).to eq 1
      expect(result.keys.first.to_s).to eq so_rule1.uid

      responses = result[so_rule1.uid.to_sym][:responses]

      response_ids = responses.map {|r| r[:response_id]}
      expect(
        Set[*response_ids] == Set[f_h1.id, f_h2.id]
      ).to be true

    end

    it 'should include rules that have no related FeedbackHistory records' do
      so_rule1 = create(:evidence_rule, name: 'so_rule1', rule_type: 'autoML')

      result = RuleFeedbackHistory.generate_rulewise_report(
        rule_uid: so_rule1.uid,
        prompt_id: 1,
        start_date: nil,
        end_date: nil)

      expect(result.keys.length).to eq 1
      expect(result.keys.first.to_s).to eq so_rule1.uid

      responses = result[so_rule1.uid.to_sym][:responses]

      expect(responses.length).to eq(0)
    end

    it 'should filter feedback histories by prompt id, used=true and time params' do
      so_rule1 = create(:evidence_rule, name: 'so_rule1', rule_type: 'autoML')
      unused_rule = create(:evidence_rule, name: 'unused', rule_type: 'autoML')
      activity_session = create(:activity_session)

      f_h1 = create(:feedback_history, rule_uid: so_rule1.uid)
      f_h2 = create(:feedback_history, rule_uid: so_rule1.uid, prompt_id: 1, created_at: "2021-02-07T19:02:54.814Z")
      f_h3 = create(:feedback_history, rule_uid: unused_rule.uid)
      f_h4 = create(:feedback_history, rule_uid: so_rule1.uid, prompt_id: 1, used: false)
      f_h5 = create(:feedback_history, rule_uid: so_rule1.uid, prompt_id: 1, created_at: "2021-03-07T19:02:54.814Z", feedback_session_uid: activity_session.uid)
      f_h6 = create(:feedback_history, rule_uid: so_rule1.uid, prompt_id: 1, created_at: "2021-05-07T19:02:54.814Z", feedback_session_uid: activity_session.uid)

      result = RuleFeedbackHistory.generate_rulewise_report(
        rule_uid: so_rule1.uid,
        prompt_id: 1,
        start_date: "2021-03-07T19:02:54.814Z",
        end_date: "2021-04-07T19:02:54.814Z")

      expect(result.keys.length).to eq 1
      expect(result.keys.first.to_s).to eq so_rule1.uid

      responses = result[so_rule1.uid.to_sym][:responses]

      response_ids = responses.map {|r| r[:response_id]}

      expect(
        Set[*response_ids] == Set[f_h5.id]
      ).to be true

    end

    it 'should display the most recent feedback history rating, if it exists' do
      so_rule1 = create(:evidence_rule, name: 'so_rule1', rule_type: 'autoML')
      unused_rule = create(:evidence_rule, name: 'unused', rule_type: 'autoML')

      user1 = create(:user)
      user2 = create(:user)

      f_h1 = create(:feedback_history, rule_uid: so_rule1.uid, prompt_id: 1)
      f_h2 = create(:feedback_history, rule_uid: so_rule1.uid, prompt_id: 1)
      f_h3 = create(:feedback_history, rule_uid: unused_rule.uid, prompt_id: 1)

      f_h_r1_old = FeedbackHistoryRating.create!(
        feedback_history_id: f_h1.id,
        user_id: user1.id,
        rating: false,
        updated_at: 1.days.ago
      )
      f_h_r1_new = FeedbackHistoryRating.create!(
        feedback_history_id: f_h1.id,
        user_id: user2.id,
        rating: true,
        updated_at: Time.current
      )
      result = RuleFeedbackHistory.generate_rulewise_report(
        rule_uid: so_rule1.uid,
        prompt_id: 1,
        start_date: nil,
        end_date: nil)

      expect(result.keys.length).to eq 1
      expect(result.keys.first.to_s).to eq so_rule1.uid

      responses = result[so_rule1.uid.to_sym][:responses]

      rated_response = responses.find {|r| r[:response_id] == f_h1.id }

      expect(rated_response[:strength]).to eq true

    end
  end

  describe '#feedback_history_to_json' do
    it 'should render feedback history to json object' do
      so_rule = create(:evidence_rule, name: 'so_rule', rule_type: 'autoML')
      f_h = create(:feedback_history, rule_uid: so_rule.uid, prompt_id: 1)
      result = RuleFeedbackHistory.feedback_history_to_json(f_h)
      expected = {
        response_id: f_h.id,
        datetime: f_h.updated_at,
        entry: f_h.entry,
        highlight: f_h.metadata.instance_of?(Hash) ? f_h.metadata['highlight'] : '',
        api: {},
        session_uid: f_h.feedback_session_uid,
        strength: f_h.feedback_history_ratings.order(updated_at: :desc).first&.rating
      }
      expect(result).to eq expected
    end
  end

end
