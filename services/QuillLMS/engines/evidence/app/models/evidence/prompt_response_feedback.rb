# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_prompt_response_feedbacks
#
#  id                 :bigint           not null, primary key
#  feedback           :text             not null
#  metadata           :jsonb
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  prompt_response_id :integer          not null
#
module Evidence
  class PromptResponseFeedback < ApplicationRecord
    belongs_to :prompt_response

    validates :feedback, presence: true
    validates :prompt_response, presence: true
  end
end
