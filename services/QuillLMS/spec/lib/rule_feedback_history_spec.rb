# frozen_string_literal: true

require 'rails_helper'

RSpec.describe RuleFeedbackHistory, type: :model do
  before do
    # This is for CircleCI. Note that this refresh is NOT concurrent.
    ActiveRecord::Base.refresh_materialized_view('feedback_histories_grouped_by_rule_uid', concurrently: false)
  end

  def rule_factory(&hash_block)
    Evidence::Rule.create!(
      {
        uid: SecureRandom.uuid,
        name: 'name',
        universal: true,
        suborder: 1,
        rule_type: Evidence::Rule::TYPES.first,
        optimal: true,
        concept_uid: SecureRandom.uuid,
        state: Evidence::Rule::STATES.first
      }.merge(yield)
    )
  end

  def activity_factory(&hash_block)
    Evidence::Activity.create!(
      {
        title: "Activity Title",
        notes: "Activity notes",
        target_level: 1,
        parent_activity_id: 1
      }.merge(yield)
    )
  end

  def prompt_factory(&hash_block)
    Evidence::Prompt.create!(
      {
        activity: yield[:activity] || activity_factory { {} },
        conjunction: "because",
        text: "my text would go here.",
        max_attempts_feedback: "MyText"
      }.merge(yield)
    )
  end

  def prompt_rule_factory(&hash_block)
    Evidence::PromptsRule.find_or_create_by!(
      {
        prompt: yield[:prompt] || prompt_factory { {} },
        rule: yield[:rule] || rule_factory { {} }
      }.merge(yield)
    )
  end

  def feedback_factory(&hash_block)
    Evidence::Feedback.create!(
      {
        rule: rule_factory { {} },
        text: 'Feedback string',
        description: 'Internal description of feedback',
        order: 1
      }.merge(yield)
    )
  end

  describe '#generate_report' do
    it 'should format' do
      # activities
      activity1 = activity_factory { {title: 'Title 1', parent_activity_id: 1, target_level: 1, notes: 'an_activity_1'} }

      # prompts
      so_prompt1 = prompt_factory { {activity: activity1, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback'} }
      because_prompt1 = prompt_factory { {activity: activity1, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback'} }

      # rules
      so_rule1 = rule_factory { { name: 'so_rule1', rule_type: 'autoML'} }

      # prompts_rules
      prompt_rule = prompt_rule_factory { {prompt: so_prompt1, rule: so_rule1} }

      # feedback
      so_feedback1 = feedback_factory { { rule: so_rule1 } }
      so_feedback2 = feedback_factory { { rule: so_rule1, order: 2 } }

      # feedback_histories
      f_h1 = create(:feedback_history, prompt: so_prompt1, rule_uid: so_rule1.uid, entry: "f_h1 lorem")
      f_h2 = create(:feedback_history, prompt: so_prompt1, rule_uid: so_rule1.uid, entry: "f_h2 ipsum")

      # users
      user1 = create(:user)
      user2 = create(:user)

      #feedback ratings
      f_rating_1a = FeedbackHistoryRating.create!(feedback_history_id: f_h1.id, user_id: user1.id, rating: true)
      f_rating_1b = FeedbackHistoryRating.create!(feedback_history_id: f_h1.id, user_id: user2.id, rating: false)
      f_rating_2a = FeedbackHistoryRating.create!(feedback_history_id: f_h2.id, user_id: user1.id, rating: true)
      f_rating_2b = FeedbackHistoryRating.create!(feedback_history_id: f_h2.id, user_id: user2.id, rating: nil)

      #feedback flags
      flag_consecutive = create(:feedback_history_flag, feedback_history_id: f_h1.id, flag: FeedbackHistoryFlag::FLAG_REPEATED_RULE_CONSECUTIVE)
      flag_non_consecutive = create(:feedback_history_flag, feedback_history_id: f_h1.id, flag: FeedbackHistoryFlag::FLAG_REPEATED_RULE_NON_CONSECUTIVE)

      report = RuleFeedbackHistory.generate_report(conjunction: 'so', activity_id: activity1.id, start_date: nil, end_date: nil)

      expected = {
        api_name: so_rule1.rule_type,
        rule_order: so_rule1.suborder,
        first_feedback: so_feedback1.text,
        second_feedback: so_feedback2.text,
        rule_name: so_rule1.name,
        rule_note: so_rule1.note,
        rule_uid: so_rule1.uid,
        strong_responses: 2,
        total_responses: 2,
        weak_responses: 1,
        repeated_consecutive_responses: 1,
        repeated_non_consecutive_responses: 1,
      }

      expect(report.first).to eq(expected)

    end
  end

  describe '#exec_query' do
    it 'should aggregate feedbacks for a given rule' do
      # activities
      activity1 = Evidence::Activity.create!(title: 'Title 1', parent_activity_id: 1, target_level: 1, notes: 'an_activity_1')

      # prompts
      so_prompt1 = Evidence::Prompt.create!(activity: activity1, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
      because_prompt1 = Evidence::Prompt.create!(activity: activity1, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')

      # rules
      so_rule1 = rule_factory { { name: 'so_rule1', rule_type: 'autoML' } }
      so_rule2 = rule_factory { { name: 'so_rule2', rule_type: 'autoML' } }
      so_rule3 = rule_factory { { name: 'so_rule3', rule_type: 'autoML' } }
      so_rule4 = rule_factory { { name: 'so_rule4', rule_type: 'autoML' } }

      # prompts_rules
      prompt_rule = prompt_rule_factory { {prompt: so_prompt1, rule: so_rule1} }
      prompt_rule = prompt_rule_factory { {prompt: so_prompt1, rule: so_rule2} }
      prompt_rule = prompt_rule_factory { {prompt: so_prompt1, rule: so_rule3} }
      prompt_rule = prompt_rule_factory { {prompt: so_prompt1, rule: so_rule4} }

      # activity_session
      activity_session = create(:activity_session)

      # feedbacks
      create(:feedback_history, prompt: so_prompt1, rule_uid: so_rule1.uid, time: "2021-03-07T19:02:54.814Z", feedback_session_uid: activity_session.uid)
      create(:feedback_history, prompt: so_prompt1, rule_uid: so_rule2.uid, time: "2021-04-07T19:02:54.814Z", feedback_session_uid: "def")
      create(:feedback_history, prompt: so_prompt1, rule_uid: so_rule3.uid, time: "2021-05-07T19:02:54.814Z", feedback_session_uid: "ghi")
      create(:feedback_history, prompt: so_prompt1, rule_uid: so_rule4.uid, time: "2021-06-07T19:02:54.814Z", feedback_session_uid: "abc")

      uid = FeedbackSession.find_by(activity_session_uid: "abc").uid
      sql_result = RuleFeedbackHistory.exec_query(conjunction: 'so', activity_id: activity1.id, start_date: "2021-03-06T19:02:54.814Z", end_date: "2021-04-10T19:02:54.814Z")
      expect(sql_result.all.length).to eq 1
      expect(sql_result[0].rule_type).to eq 'autoML'
    end
  end

  describe '#generate_rulewise_report' do
    it 'should render feedback histories' do
      so_rule1 = rule_factory { { name: 'so_rule1', rule_type: 'autoML'} }
      unused_rule = rule_factory { { name: 'unused', rule_type: 'autoML'} }

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
      so_rule1 = rule_factory { { name: 'so_rule1', rule_type: 'autoML'} }

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
      so_rule1 = rule_factory { { name: 'so_rule1', rule_type: 'autoML'} }
      unused_rule = rule_factory { { name: 'unused', rule_type: 'autoML'} }
      activity_session = create(:activity_session)

      f_h1 = create(:feedback_history, rule_uid: so_rule1.uid)
      f_h2 = create(:feedback_history, rule_uid: so_rule1.uid, prompt_id: 1, created_at: "2021-02-07T19:02:54.814Z")
      f_h3 = create(:feedback_history, rule_uid: unused_rule.uid)
      f_h4 = create(:feedback_history, rule_uid: so_rule1.uid, prompt_id: 1, used: false)
      f_h5 = create(:feedback_history, rule_uid: so_rule1.uid, prompt_id: 1, created_at: "2021-03-07T19:02:54.814Z", feedback_session_uid: activity_session.uid)
      f_h6 = create(:feedback_history, rule_uid: so_rule1.uid, prompt_id: 1, created_at: "2021-04-07T19:02:54.814Z", feedback_session_uid: "abc")
      f_h7 = create(:feedback_history, rule_uid: so_rule1.uid, prompt_id: 1, created_at: "2021-05-07T19:02:54.814Z", feedback_session_uid: activity_session.uid)

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
      so_rule1 = rule_factory { { name: 'so_rule1', rule_type: 'autoML'} }
      unused_rule = rule_factory { { name: 'unused', rule_type: 'autoML'} }

      # users
      user1 = create(:user)
      user2 = create(:user)

      # feedback histories
      f_h1 = create(:feedback_history, rule_uid: so_rule1.uid, prompt_id: 1)
      f_h2 = create(:feedback_history, rule_uid: so_rule1.uid, prompt_id: 1)
      f_h3 = create(:feedback_history, rule_uid: unused_rule.uid, prompt_id: 1)

      # feedback history ratings
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
      so_rule = rule_factory { { name: 'so_rule', rule_type: 'autoML'} }
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
