# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompts
#
#  id                         :bigint           not null, primary key
#  locked                     :boolean          not null
#  optimal_examples_count       :integer          not null
#  optimal_guidelines_count     :integer          not null
#  suboptimal_examples_count   :integer          not null
#  suboptimal_guidelines_count :integer          not null
#  prompt                     :text             not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  llm_prompt_template_id     :integer          not null
#

module Evidence
  module Research
    module GenAI
      FactoryBot.define do
        factory :evidence_research_gen_ai_llm_prompt, class: 'Evidence::Research::GenAI::LLMPrompt' do
          llm_prompt_template { association :evidence_research_gen_ai_llm_prompt_template }
          prompt { 'This is the prompt' }
          locked { false }

          optimal_guidelines_count { 1 }
          suboptimal_guidelines_count { 1 }
          optimal_examples_count { 1 }
          suboptimal_examples_count { 1 }
        end
      end
    end
  end
end
