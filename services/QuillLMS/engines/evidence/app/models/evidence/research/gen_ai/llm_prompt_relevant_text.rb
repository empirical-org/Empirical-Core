# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompt_relevant_texts
#
#  id               :bigint           not null, primary key
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  llm_prompt_id    :integer          not null
#  relevant_text_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class LLMPromptRelevantText < ApplicationRecord
        belongs_to :llm_prompt
        belongs_to :relevant_text

        validates :llm_prompt_id, presence: true
        validates :relevant_text_id, presence: true

        attr_readonly :llm_prompt_id, :relevant_text_id
      end
    end
  end
end
