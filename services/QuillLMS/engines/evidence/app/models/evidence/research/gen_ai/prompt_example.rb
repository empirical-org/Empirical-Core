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
        STAFF_ASSIGNED_STATUSES = [
          OPTIMAL = 'optimal',
          SUBOPTIMAL = 'suboptimal'
        ].freeze

        belongs_to :dataset

        validates :staff_assigned_status, presence: true
        validates :student_response, presence: true
        validates :dataset_id, presence: true

        attr_readonly :staff_assigned_status, :dataset_id, :student_response

        scope :optimal, -> { where(human_status: OPTIMAL) }
        scope :suboptimal, -> { where(human_status: SUBOPTIMAL) }
      end
    end
  end
end
