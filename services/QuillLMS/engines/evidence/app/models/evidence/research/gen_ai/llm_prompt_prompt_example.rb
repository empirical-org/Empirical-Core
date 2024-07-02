# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompt_prompt_examples
#
#  id                :bigint           not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  llm_prompt_id     :integer          not null
#  prompt_example_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class LLMPromptPromptExample < ApplicationRecord
        LOCKED = 'locked'

        belongs_to :llm_prompt
        belongs_to :prompt_example

        validates :llm_prompt_id, presence: true
        validates :prompt_example_id, presence: true

        attr_readonly :llm_prompt_id, :prompt_example_id

        validate :llm_prompt_unlocked, on: :create

        private def llm_prompt_unlocked
          errors.add(:llm_prompt, LOCKED) if llm_prompt&.locked
        end
      end
    end
  end
end
