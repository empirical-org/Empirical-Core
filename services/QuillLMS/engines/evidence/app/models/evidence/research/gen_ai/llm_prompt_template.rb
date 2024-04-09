# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompt_templates
#
#  id          :bigint           not null, primary key
#  contents    :text             not null
#  description :text             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
module Evidence
  module Research
    module GenAI
      class LLMPromptTemplate < ApplicationRecord
        validates :description, presence: true
        validates :contents, presence: true

        attr_readonly :description, :contents

        has_many :llm_prompts,
          class_name: 'Evidence::Research::GenAI::LLMPrompt',
          dependent: :destroy

        def to_s = description
      end
    end
  end
end
