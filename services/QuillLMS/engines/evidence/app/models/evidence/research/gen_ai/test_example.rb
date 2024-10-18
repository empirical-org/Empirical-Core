# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_test_examples
#
#  id                           :bigint           not null, primary key
#  automl_label                 :string
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
      class TestExample < ApplicationRecord
        include HasAssignedStatus

        LOCKED = 'locked'

        belongs_to :dataset

        default_scope { order(created_at: :asc) }

        validates :curriculum_assigned_status, presence: true
        validates :student_response, presence: true
        validates :dataset_id, presence: true

        validate :dataset_unlocked, on: :create

        attr_readonly :curriculum_assigned_status, :dataset_id, :student_response

        def self.assigned_status_column = :curriculum_assigned_status

        def rag_label
          return curriculum_label if curriculum_label.start_with?('Label_')
          return 'Optimal' if curriculum_label.start_with?('Optimal')

          curriculum_label
        end

        private def dataset_unlocked
          errors.add(:dataset, LOCKED) if dataset&.locked
        end
      end
    end
  end
end
