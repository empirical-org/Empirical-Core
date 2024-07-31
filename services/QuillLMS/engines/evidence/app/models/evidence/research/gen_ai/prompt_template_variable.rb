# frozen_string_literal: true

#
# == Schema Information
#
# Table name: evidence_research_gen_ai_prompt_template_variables
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  value      :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
module Evidence
  module Research
    module GenAI
      class PromptTemplateVariable < ApplicationRecord
        NAMES = %w[
          general_rules
          task_introduction
          final_instructions
        ]

        validates :name,  presence: true, inclusion: { in: NAMES }
        validates :value, presence: true
        attr_readonly :name, :value

        def self.general_substitutions = all.map(&:substitution)

        def substitution = "#{LLMPromptBuilder::DELIMITER}#{name},#{id}#{LLMPromptBuilder::DELIMITER}"
      end
    end
  end
end
