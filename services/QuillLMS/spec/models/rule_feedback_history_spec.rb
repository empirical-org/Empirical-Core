require 'rails_helper'

RSpec.describe RuleFeedbackHistory, type: :model do
  def rule_factory(&hash_block) 
    Comprehension::Rule.create!(
      {
        uid: SecureRandom.uuid,
        name: 'name',
        universal: true,
        rule_type: Comprehension::Rule::TYPES.first,
        optimal: true,
        concept_uid: SecureRandom.uuid,
        state: Comprehension::Rule::STATES.first
      }.merge(yield)
    )
  end 

  it 'should foo' do 
    activity1 = Comprehension::Activity.create!(title: 'Title 1', parent_activity_id: 1, target_level: 1)

    # prompts
    so_prompt_1 = Comprehension::Prompt.create!(activity: activity1, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
    because_prompt_1 = Comprehension::Prompt.create!(activity: activity1, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
  
    # rules
    so_rule_1 = rule_factory { { name: 'so_rule_1', rule_type: 'autoML'} } 
    because_rule_1 = rule_factory { {name: 'because_rule_1'} } 

    # prompts rules
    Comprehension::PromptsRule.create!(prompt: so_prompt_1, rule: so_rule_1)
    Comprehension::PromptsRule.create!(prompt: because_prompt_1, rule: because_rule_1)

    result = RuleFeedbackHistory.generate_report('so')

    binding.pry



    # create(:user) do |user|
    #     user.posts.create(attributes_for(:post))
    #   end


    # prompt = params[:prompt]
    # rules = Rule.where(prompt: prompt)
    # rules.join(feedback_histories)

    # CREATE TABLE public.comprehension_feedbacks (
    #     id integer NOT NULL,
    #     rule_id integer NOT NULL,
    #     text character varying NOT NULL,
    #     description character varying,
    #     "order" integer NOT NULL,
    #     created_at timestamp without time zone NOT NULL,
    #     updated_at timestamp without time zone NOT NULL
    # );

#     CREATE TABLE public.comprehension_rules (
#     id integer NOT NULL,
#     uid character varying NOT NULL,
#     name character varying NOT NULL,
#     description character varying,
#     universal boolean NOT NULL,
#     rule_type character varying NOT NULL,
#     optimal boolean NOT NULL,
#     suborder integer,
#     concept_uid character varying NOT NULL,
#     created_at timestamp without time zone NOT NULL,
#     updated_at timestamp without time zone NOT NULL
# );


  end
end