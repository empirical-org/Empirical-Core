# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_passage_prompt_response_exemplars
#
#  id                                  :bigint           not null, primary key
#  response                            :text             not null
#  created_at                          :datetime         not null
#  updated_at                          :datetime         not null
#  passage_prompt_response_feedback_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class PassagePromptResponseExemplar < ApplicationRecord
        belongs_to :passage_prompt_response_feedback, class_name: 'Evidence::Research::GenAI::PassagePromptResponseFeedback'

        validates :response, presence: true
      end
    end
  end
end
