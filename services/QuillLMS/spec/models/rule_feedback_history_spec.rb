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
      activity1 = Comprehension::Activity.create!(title: 'Title 1', parent_activity_id: 1, target_level: 1)

      # prompts
      so_prompt_1 = Comprehension::Prompt.create!(activity: activity1, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
      because_prompt_1 = Comprehension::Prompt.create!(activity: activity1, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
    
      # rules
      so_rule_1 = rule_factory { { name: 'so_rule_1', rule_type: 'autoML'} } 
      because_rule_1 = rule_factory { {name: 'because_rule_1'} } 

      # feedbacks
      create(:feedback_history, rule_uid: so_rule_1.uid)
      create(:feedback_history, rule_uid: so_rule_1.uid)

      # prompts rules
      Comprehension::PromptsRule.create!(prompt: so_prompt_1, rule: so_rule_1)
      Comprehension::PromptsRule.create!(prompt: because_prompt_1, rule: because_rule_1)

      sql_result = RuleFeedbackHistory.exec_query(conjunction: 'so', activity_id: activity1.id)
      formatted = RuleFeedbackHistory.format_sql_results(sql_result)
      expect(formatted.first).to eq(
        {
          api_name: 'autoML',
          rule_order: "1", 
          feedback_first_layer: 'To Be Implemented', 
          rule_description: 'so_rule_1',
          pct_strong: 0, 
          scored_responses: 0,
          pct_scored: 0          
        }
      )
    end
  end

  describe '#exec_query' do 
    it 'should aggregate feedbacks for a given rule' do 
      # activities
      activity1 = Comprehension::Activity.create!(title: 'Title 1', parent_activity_id: 1, target_level: 1)

      # prompts
      so_prompt_1 = Comprehension::Prompt.create!(activity: activity1, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
      because_prompt_1 = Comprehension::Prompt.create!(activity: activity1, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
    
      # rules
      so_rule_1 = rule_factory { { name: 'so_rule_1', rule_type: 'autoML'} } 
      because_rule_1 = rule_factory { {name: 'because_rule_1'} } 

      # feedbacks
      create(:feedback_history, rule_uid: so_rule_1.uid)
      create(:feedback_history, rule_uid: so_rule_1.uid)

      # prompts rules
      Comprehension::PromptsRule.create!(prompt: so_prompt_1, rule: so_rule_1)
      Comprehension::PromptsRule.create!(prompt: because_prompt_1, rule: because_rule_1)

      sql_result = RuleFeedbackHistory.exec_query(conjunction: 'so', activity_id: activity1.id)

      expect(sql_result.count).to eq 1
      expect(sql_result.first.rule_type).to eq 'autoML'
      expect(sql_result.first.feedback_histories_count).to eq 2
    end

    xit 'should only return results related to the specified activity' do 
    end
  end


end