# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_passage_prompt_responses
#
#  id                :bigint           not null, primary key
#  response          :text             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  passage_prompt_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class PassagePromptResponse < ApplicationRecord
        belongs_to :passage_prompt, class_name: 'Evidence::Research::GenAI::PassagePrompt'

        has_one :example_feedback, class_name: 'Evidence::Research::GenAI::ExampleFeedback', dependent: :destroy
        has_many :llm_feedbacks, class_name: 'Evidence::Research::GenAI::LLMFeedback', dependent: :destroy

        validates :response, presence: true
        validates :passage_prompt_id, presence: true

        attr_readonly :response, :passage_prompt_id

        def self.testing_data
          joins(:example_feedback)
            .where(example_feedback: { data_partition: ExampleFeedback::TESTING_DATA })
        end

        def example_optimal? = example_feedback.optimal?

        def to_s = response
      end
    end
  end
end
