# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_test_examples
#
#  id                    :bigint           not null, primary key
#  automl_feedback       :text
#  automl_status         :string
#  highlight             :text
#  staff_assigned_status :string           not null
#  staff_feedback        :text
#  student_response      :text             not null
#  topic_tag             :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  dataset_id            :integer          not null
#
module Evidence
  module Research
    module GenAI
      class TestExample < ApplicationRecord
        include HasAssignedStatus

        LOCKED = 'locked'

        belongs_to :dataset

        default_scope { order(created_at: :asc) }

        validates :staff_assigned_status, presence: true
        validates :student_response, presence: true
        validates :dataset_id, presence: true

        validate :dataset_unlocked, on: :create

        attr_readonly :staff_assigned_status, :dataset_id, :student_response

        def self.assigned_status_column = :staff_assigned_status

        private def dataset_unlocked
          errors.add(:dataset, LOCKED) if dataset&.locked
        end
      end
    end
  end
end
