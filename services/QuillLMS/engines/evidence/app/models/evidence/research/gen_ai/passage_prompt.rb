# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_passage_prompts
#
#  id           :bigint           not null, primary key
#  conjunction  :string           not null
#  instructions :text             not null
#  prompt       :text             not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  passage_id   :integer          not null
#
module Evidence
  module Research
    module GenAI
      class PassagePrompt < ApplicationRecord
        CONJUNCTIONS = [
          BECAUSE = 'because',
          BUT = 'but',
          SO = 'so'
        ].freeze

        belongs_to :passage, class_name: 'Evidence::Research::GenAI::Passage'

        has_many :passage_prompt_responses,
          class_name: 'Evidence::Research::GenAI::PassagePromptResponse',
          dependent: :destroy

        has_many :example_prompt_response_feedbacks,
          class_name: 'Evidence::Research::GenAI::ExamplePromptResponseFeedback',
          through: :passage_prompt_responses

        has_many :llm_prompt_response_feedbacks,
          class_name: 'Evidence::Research::GenAI::LLMPromptResponseFeedback',
          through: :passage_prompt_responses

        validates :prompt, presence: true
        validates :conjunction, presence: true, inclusion: { in: CONJUNCTIONS }
        validates :instructions, presence: true
        validates :passage_id, presence: true

        attr_readonly :prompt, :conjunction, :instructions, :passage_id

        delegate :name, to: :passage

        def to_s = "##{name} - #{conjunction}"
      end
    end
  end
end
