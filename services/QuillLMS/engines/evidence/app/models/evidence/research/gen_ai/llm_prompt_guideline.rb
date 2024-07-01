# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompt_guidelines
#
#  id            :bigint           not null, primary key
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  guideline_id  :integer          not null
#  llm_prompt_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class LLMPromptGuideline < ApplicationRecord
        LOCKED = 'locked'

        belongs_to :llm_prompt
        belongs_to :guideline

        validates :llm_prompt_id, presence: true
        validates :guideline_id, presence: true

        attr_readonly :llm_prompt_id, :guideline_id

        validate :llm_prompt_unlocked, on: :create

        private def llm_prompt_unlocked
          errors.add(:llm_prompt, LOCKED) if llm_prompt&.locked
        end
      end
    end
  end
end
