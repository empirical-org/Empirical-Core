# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_prompt_examples
#
#  id                           :bigint           not null, primary key
#  automl_label                 :text
#  automl_primary_feedback      :text
#  automl_secondary_feedback    :text
#  curriculum_assigned_status   :string           not null
#  curriculum_label             :string
#  curriculum_proposed_feedback :text
#  highlight                    :text
#  student_response             :text             not null
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  dataset_id                   :integer          not null
#
module Evidence
  module Research
    module GenAI
      class PromptExample < ApplicationRecord
        include HasAssignedStatus

        default_scope { order(created_at: :asc) }

        belongs_to :dataset

        validates :curriculum_assigned_status, presence: true
        validates :student_response, presence: true
        validates :dataset_id, presence: true

        attr_readonly :curriculum_assigned_status, :dataset_id, :student_response

        def self.assigned_status_column = :curriculum_assigned_status

        def feedback = curriculum_proposed_feedback || automl_primary_feedback

        def response_feedback_status = {student_response:, feedback: curriculum_proposed_feedback, optimal: optimal? }
      end
    end
  end
end
