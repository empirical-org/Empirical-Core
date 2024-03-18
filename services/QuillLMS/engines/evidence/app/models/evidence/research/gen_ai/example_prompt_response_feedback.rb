# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_example_prompt_response_feedbacks
#
#  id                         :bigint           not null, primary key
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
      end
    end
  end
end
