# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_example_prompt_response_feedbacks
#
#  id                         :bigint           not null, primary key
#  evaluation                 :text
#  feedback                   :text             not null
#  label                      :string           not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  passage_prompt_response_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class ExamplePromptResponseFeedback < ApplicationRecord
        belongs_to :passage_prompt_response, class_name: 'Evidence::Research::GenAI::PassagePromptResponse'

        validates :feedback, presence: true
        validates :label, presence: true
        validates :passage_prompt_response_id, presence: true

        attr_readonly :feedback, :label, :passage_prompt_response_id

        delegate :response, to: :passage_prompt_response

        def response_and_feedback = "Response: #{response}\nFeedback: #{feedback}"
      end
    end
  end
end
