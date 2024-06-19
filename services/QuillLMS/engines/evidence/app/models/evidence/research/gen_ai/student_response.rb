# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_student_responses
#
#  id            :bigint           not null, primary key
#  text          :text             not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  stem_vault_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class StudentResponse < ApplicationRecord
        belongs_to :stem_vault, class_name: 'Evidence::Research::GenAI::StemVault'

        has_one :quill_feedback, class_name: 'Evidence::Research::GenAI::QuillFeedback', dependent: :destroy
        has_many :llm_feedbacks, class_name: 'Evidence::Research::GenAI::LLMFeedback', dependent: :destroy

        validates :text, presence: true
        validates :stem_vault_id, presence: true

        attr_readonly :text, :stem_vault_id

        def self.testing_data = joins(:quill_feedback).merge(QuillFeedback.testing_data)
        def self.fine_tuning_data = joins(:quill_feedback).merge(QuillFeedback.fine_tuning_data)
        def self.prompt_engineering_data = joins(:quill_feedback).merge(QuillFeedback.prompt_engineering_data)

        def quill_optimal? = quill_feedback.optimal?

        def to_s = text
      end
    end
  end
end
