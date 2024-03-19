# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_experiments
#
#  id                :bigint           not null, primary key
#  results           :jsonb
#  status            :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  llm_config_id     :integer          not null
#  llm_prompt_id     :integer          not null
#  passage_prompt_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class Experiment < ApplicationRecord
        belongs_to :llm_config, class_name: 'Evidence::Research::GenAI::LLMConfig'
        belongs_to :llm_prompt, class_name: 'Evidence::Research::GenAI::LLMPrompt'
        belongs_to :passage_prompt, class_name: 'Evidence::Research::GenAI::PassagePrompt'

        validates :status, presence: true
      end
    end
  end
end
