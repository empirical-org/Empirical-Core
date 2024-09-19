# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompt_templates
#
#  id         :bigint           not null, primary key
#  contents   :text             not null
#  name       :text             not null
#  notes      :text
#  order      :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
module Evidence
  module Research
    module GenAI
      class LLMPromptTemplate < ApplicationRecord
        validates :name, presence: true
        validates :contents, presence: true
        validates :order, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

        attr_readonly :name, :contents

        has_many :llm_prompts, dependent: :destroy

        before_validation :set_default_order

        def num_trials = Trial.where(llm_prompt: llm_prompts).count

        def to_s = name

        private def set_default_order
          self.order ||= (self.class.maximum(:order) || 0) + 1
        end
      end
    end
  end
end
