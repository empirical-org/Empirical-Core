require 'rails_helper'

RSpec.describe RuleFeedbackHistory, type: :model do
  before do
    # This is for CircleCI. Note that this refresh is NOT concurrent.
    ActiveRecord::Base.refresh_materialized_view('feedback_histories_grouped_by_rule_uid', false)
  end

  def rule_factory(&hash_block)
    Comprehension::Rule.create!(
      {
        uid: SecureRandom.uuid,
        name: 'name',
        universal: true,
        suborder: 1,
        rule_type: Comprehension::Rule::TYPES.first,
        optimal: true,
        concept_uid: SecureRandom.uuid,
        state: Comprehension::Rule::STATES.first
      }.merge(yield)
    )
  end

  describe '#generate_report' do
    it 'should format' do
      # activities
      activity1 = Comprehension::Activity.create!(title: 'Title 1', parent_activity_id: 1, target_level: 1, name: 'an_activity_1')

      # prompts
      so_prompt1 = Comprehension::Prompt.create!(activity: activity1, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
      because_prompt1 = Comprehension::Prompt.create!(activity: activity1, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')

      # rules
      so_rule1 = rule_factory { { name: 'so_rule1', rule_type: 'autoML'} }

      # feedbacks
      create(:feedback_history, rule_uid: so_rule1.uid)
      create(:feedback_history, rule_uid: so_rule1.uid)

      report = RuleFeedbackHistory.generate_report(conjunction: 'so', activity_id: activity1.id)

      expected = {
        api_name: so_rule1.rule_type,
        rule_order: so_rule1.suborder,
        first_feedback: '',
        rule_name: so_rule1.name,
        rule_note: so_rule1.note,
        rule_uid: so_rule1.uid,
        strong_responses: 0,
        total_responses: 0,
        weak_responses: 0,
        repeated_consecutive_responses: 0,
        repeated_non_consecutive_responses: 0,
      }

      expect(expected).to eq(report.first)

    end
  end

  describe '#postprocessing' do
    it 'should include feedback_histories' do
      # activities
      activity1 = Comprehension::Activity.create!(title: 'Title 1', parent_activity_id: 1, target_level: 1, name: 'an_activity_1')

      # prompts
      so_prompt1 = Comprehension::Prompt.create!(activity: activity1, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
      because_prompt1 = Comprehension::Prompt.create!(activity: activity1, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')

      # rules
      so_rule1 = rule_factory { { name: 'so_rule1', rule_type: 'autoML'} }

      #feedbacks
      f3 = Comprehension::Feedback.create!(rule_id: so_rule1.id, order: 3, text: 'lorem ipsum dolor 3')
      f1 = Comprehension::Feedback.create!(rule_id: so_rule1.id, order: 1, text: 'lorem ipsum dolor 1')
      f2 = Comprehension::Feedback.create!(rule_id: so_rule1.id, order: 2, text: 'lorem ipsum dolor 2')

      # feedback_histories
      create(:feedback_history, rule_uid: so_rule1.uid)
      create(:feedback_history, rule_uid: so_rule1.uid)

      sql_result = RuleFeedbackHistory.exec_query(conjunction: 'so', activity_id: activity1.id)
      post_result = RuleFeedbackHistory.postprocessing(sql_result)

      expect(post_result.first.first_feedback).to eq f1.text
    end

    it 'should calculate rating metrics correctly' do
        user1 = create(:user)
        user2 = create(:user)

        # activities
        activity1 = Comprehension::Activity.create!(title: 'Title 1', parent_activity_id: 1, target_level: 1, name: 'an_activity_1')

        # prompts
        so_prompt1 = Comprehension::Prompt.create!(activity: activity1, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
        because_prompt1 = Comprehension::Prompt.create!(activity: activity1, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')

        # rules
        so_rule1 = rule_factory { { name: 'so_rule1', rule_type: 'autoML'} }

        #feedbacks
        f3 = Comprehension::Feedback.create!(rule_id: so_rule1.id, order: 3, text: 'lorem ipsum dolor 3')
        f1 = Comprehension::Feedback.create!(rule_id: so_rule1.id, order: 1, text: 'lorem ipsum dolor 1')
        f2 = Comprehension::Feedback.create!(rule_id: so_rule1.id, order: 2, text: 'lorem ipsum dolor 2')

        # feedback_histories
        f_h1 = create(:feedback_history, rule_uid: so_rule1.uid, entry: "f_h1 lorem")
        f_h2 = create(:feedback_history, rule_uid: so_rule1.uid, entry: "f_h2 ipsum")

        #feedback ratings
        f_rating_1a = FeedbackHistoryRating.create!(feedback_history_id: f_h1.id, user_id: user1.id, rating: true)
        f_rating_1b = FeedbackHistoryRating.create!(feedback_history_id: f_h1.id, user_id: user2.id, rating: false)
        f_rating_2a = FeedbackHistoryRating.create!(feedback_history_id: f_h2.id, user_id: user1.id, rating: true)

        #feedback flags
        flag_consecutive = create(:feedback_history_flag, feedback_history_id: f_h1.id, flag: FeedbackHistoryFlag::FLAG_REPEATED_RULE_CONSECUTIVE)
        flag_non_consecutive = create(:feedback_history_flag, feedback_history_id: f_h1.id, flag: FeedbackHistoryFlag::FLAG_REPEATED_RULE_NON_CONSECUTIVE)

        ActiveRecord::Base.refresh_materialized_view('feedback_histories_grouped_by_rule_uid')

        sql_result = RuleFeedbackHistory.exec_query(conjunction: 'so', activity_id: activity1.id)
        post_result = RuleFeedbackHistory.postprocessing(sql_result)

        first_row = post_result.first
        expect(first_row.scored_responses_count).to eq 3
        expect(first_row.total_responses).to eq 2
        expect(first_row.total_strong).to eq 2
        expect(first_row.total_weak).to eq 1
        expect(first_row.repeated_non_consecutive).to eq 1
        expect(first_row.repeated_consecutive).to eq 1

    end
  end

  describe '#exec_query' do
    it 'should aggregate feedbacks for a given rule' do
      # activities
      activity1 = Comprehension::Activity.create!(title: 'Title 1', parent_activity_id: 1, target_level: 1, name: 'an_activity_1')

      # prompts
      so_prompt1 = Comprehension::Prompt.create!(activity: activity1, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
      because_prompt1 = Comprehension::Prompt.create!(activity: activity1, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')

      # rules
      so_rule1 = rule_factory { { name: 'so_rule1', rule_type: 'autoML'} }

      # feedbacks
      create(:feedback_history, rule_uid: so_rule1.uid)
      create(:feedback_history, rule_uid: so_rule1.uid)

      sql_result = RuleFeedbackHistory.exec_query(conjunction: 'so', activity_id: activity1.id)

      expect(sql_result.count).to eq 1
      expect(sql_result.first.rule_type).to eq 'autoML'
    end
  end

  describe '#generate_rulewise_report' do
    it 'should render feedback histories' do
      so_rule1 = rule_factory { { name: 'so_rule1', rule_type: 'autoML'} }
      unused_rule = rule_factory { { name: 'unused', rule_type: 'autoML'} }

      f_h1 = create(:feedback_history, rule_uid: so_rule1.uid)
      f_h2 = create(:feedback_history, rule_uid: so_rule1.uid)
      f_h3 = create(:feedback_history, rule_uid: unused_rule.uid)

      result = RuleFeedbackHistory.generate_rulewise_report(so_rule1.uid)

      expect(result.keys.length).to eq 1
      expect(result.keys.first.to_s).to eq so_rule1.uid

      responses = result[so_rule1.uid.to_sym][:responses]

      response_ids = responses.map {|r| r[:response_id]}
      expect(
        Set[*response_ids] == Set[f_h1.id, f_h2.id]
      ).to be true

    end

    it 'should display the most recent feedback history rating, if it exists' do
      so_rule1 = rule_factory { { name: 'so_rule1', rule_type: 'autoML'} }
      unused_rule = rule_factory { { name: 'unused', rule_type: 'autoML'} }

      # users
      user1 = create(:user)
      user2 = create(:user)

      # feedback histories
      f_h1 = create(:feedback_history, rule_uid: so_rule1.uid)
      f_h2 = create(:feedback_history, rule_uid: so_rule1.uid)
      f_h3 = create(:feedback_history, rule_uid: unused_rule.uid)

      # feedback history ratings
      f_h_r1_old = FeedbackHistoryRating.create!(
        feedback_history_id: f_h1.id,
        user_id: user1.id,
        rating: false,
        updated_at: Time.now - 1.days
      )
      f_h_r1_new = FeedbackHistoryRating.create!(
        feedback_history_id: f_h1.id,
        user_id: user2.id,
        rating: true,
        updated_at: Time.now
      )
      result = RuleFeedbackHistory.generate_rulewise_report(so_rule1.uid)

      expect(result.keys.length).to eq 1
      expect(result.keys.first.to_s).to eq so_rule1.uid

      responses = result[so_rule1.uid.to_sym][:responses]

      rated_response = responses.find {|r| r[:response_id] == f_h1.id }

      expect(rated_response[:strength]).to eq true

    end
  end

end
