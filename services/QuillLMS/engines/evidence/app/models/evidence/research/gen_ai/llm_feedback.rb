# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_feedbacks
#
#  id                  :bigint           not null, primary key
#  label               :string
#  raw_text            :text             not null
#  text                :text             not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  student_response_id :integer          not null
#  trial_id            :integer          not null
#
module Evidence
  module Research
    module GenAI
      class LLMFeedback < ApplicationRecord
        include HasOptimalAndSuboptimal

        belongs_to :trial, class_name: 'Evidence::Research::GenAI::Trial'
        belongs_to :student_response, class_name: 'Evidence::Research::GenAI::StudentResponse'

        validates :raw_text, presence: true
        validates :text, presence: true
        validates :student_response_id, presence: true
        validates :trial_id, presence: true

        attr_readonly :trial_id, :label, :student_response_id, :raw_text, :text

        delegate :quill_optimal?, :quill_feedback, to: :student_response

        def identical_feedback? = quill_feedback.text.strip == text.strip

        def optimal_or_suboptimal_match? = quill_optimal? ? optimal? : suboptimal?

        def response_and_feedback = "Response: #{student_response.text}\nFeedback: #{text}"

        def to_s = text
      end
    end
  end
end
