# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_feedbacks
#
#  id                         :bigint           not null, primary key
#  label                      :string
#  raw_text                   :text             not null
#  text                       :text             not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  passage_prompt_response_id :integer          not null
#  trial_id                   :integer          not null
#
module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_llm_feedback, class: 'Evidence::Research::GenAI::LLMFeedback' do
          trial { association :evidence_research_gen_ai_trial }
          passage_prompt_response { association :evidence_research_gen_ai_passage_prompt_response }
          raw_text { { 'feedback' => 'This is the feedback' }.to_json }
          text { 'This is the feedback' }
        end
      end
    end
  end
end
