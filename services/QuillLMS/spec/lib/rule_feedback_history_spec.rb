require 'rails_helper'

RSpec.describe RuleFeedbackHistory, type: :model do
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

  describe '#format_sql_results' do 
    it 'should format' do 
      # activities
      activity1 = Comprehension::Activity.create!(title: 'Title 1', parent_activity_id: 1, target_level: 1, name: 'an_activity_1')

      # prompts
      so_prompt1 = Comprehension::Prompt.create!(activity: activity1, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
      because_prompt1 = Comprehension::Prompt.create!(activity: activity1, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
    
      # rules
      so_rule1 = rule_factory { { name: 'so_rule1', rule_type: 'autoML'} } 
      because_rule1 = rule_factory { {name: 'because_rule1'} } 

      # feedbacks
      create(:feedback_history, rule_uid: so_rule1.uid)
      create(:feedback_history, rule_uid: so_rule1.uid)

      # prompts rules
      Comprehension::PromptsRule.create!(prompt: so_prompt1, rule: so_rule1)
      Comprehension::PromptsRule.create!(prompt: because_prompt1, rule: because_rule1)

      sql_result = RuleFeedbackHistory.exec_query(conjunction: 'so', activity_id: activity1.id)
      formatted = RuleFeedbackHistory.format_sql_results(sql_result)
      expected = {
        api_name: 'autoML',
        rule_order: "1", 
        feedback_first_layer: 'To Be Implemented', 
        rule_name: 'so_rule1',
        pct_strong: 0, 
        scored_responses: 0,
        pct_scored: 0          
      }

      expect(expected <= formatted.first).to be true

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
      because_rule1 = rule_factory { {name: 'because_rule1'} } 

      #feedbacks
      f3 = Comprehension::Feedback.create!(rule_id: so_rule1.id, order: 3, text: 'lorem ipsum dolor 3')
      f1 = Comprehension::Feedback.create!(rule_id: so_rule1.id, order: 1, text: 'lorem ipsum dolor 1')
      f2 = Comprehension::Feedback.create!(rule_id: so_rule1.id, order: 2, text: 'lorem ipsum dolor 2')

      # feedback_histories
      create(:feedback_history, rule_uid: so_rule1.uid)
      create(:feedback_history, rule_uid: so_rule1.uid)

      # prompts rules
      Comprehension::PromptsRule.create!(prompt: so_prompt1, rule: so_rule1)
      Comprehension::PromptsRule.create!(prompt: because_prompt1, rule: because_rule1)

      sql_result = RuleFeedbackHistory.exec_query(conjunction: 'so', activity_id: activity1.id)
      post_result = RuleFeedbackHistory.postprocessing(sql_result)

      expect(post_result.first.first_feedback).to eq f1.text
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
      because_rule1 = rule_factory { {name: 'because_rule1'} } 

      # feedbacks
      create(:feedback_history, rule_uid: so_rule1.uid)
      create(:feedback_history, rule_uid: so_rule1.uid)

      # prompts rules
      Comprehension::PromptsRule.create!(prompt: so_prompt1, rule: so_rule1)
      Comprehension::PromptsRule.create!(prompt: because_prompt1, rule: because_rule1)

      sql_result = RuleFeedbackHistory.exec_query(conjunction: 'so', activity_id: activity1.id)

      expect(sql_result.count).to eq 1
      expect(sql_result.first.rule_type).to eq 'autoML'
      expect(sql_result.first.feedback_histories_count).to eq 2
    end

    xit 'should only return results related to the specified activity' do 
    end


  end


end
