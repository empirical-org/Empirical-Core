# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_prompt_examples
#
#  id                    :bigint           not null, primary key
#  staff_assigned_status :string           not null
#  staff_feedback        :text
#  student_response      :text             not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  dataset_id            :integer          not null
#
module Evidence
  module Research
    module GenAI
      class PromptExample < ApplicationRecord
        include HasAssignedStatus

        default_scope { order(created_at: :asc) }

        belongs_to :dataset

        validates :staff_assigned_status, presence: true
        validates :student_response, presence: true
        validates :dataset_id, presence: true

        attr_readonly :staff_assigned_status, :dataset_id, :student_response

        def self.assigned_status_column = :staff_assigned_status

        def response_feedback_status = {student_response:, feedback: staff_feedback, optimal: optimal? }
      end
    end
  end
end
