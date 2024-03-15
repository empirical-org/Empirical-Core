# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_passage_prompt_response_feedbacks
#
#  id                :bigint           not null, primary key
#  feedback          :text             not null
#  label             :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  passage_prompt_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class PassagePromptResponseFeedback < ApplicationRecord
        belongs_to :passage_prompt, class_name: 'Evidence::Research::GenAI::PassagePrompt'

        validates :feedback, presence: true
      end
    end
  end
end
