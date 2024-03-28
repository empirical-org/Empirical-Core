# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_example_feedbacks
#
#  id                         :bigint           not null, primary key
#  chain_of_thought           :text
#  label                      :string           not null
#  paraphrase                 :text
#  text                       :text             not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  passage_prompt_response_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class ExampleFeedback < ApplicationRecord
        belongs_to :passage_prompt_response, class_name: 'Evidence::Research::GenAI::PassagePromptResponse'

        validates :text, presence: true
        validates :label, presence: true
        validates :passage_prompt_response_id, presence: true

        attr_readonly :text, :label, :passage_prompt_response_id

        delegate :response, to: :passage_prompt_response

        def response_and_feedback = "Response: #{response}\nFeedback: #{text}"

        def response_chain_of_thought_and_feedback
          "Response: #{response}\nChain-of-Thought: #{chain_of_thought}\nFeedback: #{text}"
        end
      end
    end
  end
end
