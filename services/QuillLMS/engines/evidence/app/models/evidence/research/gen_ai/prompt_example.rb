# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_prompt_examples
#
#  id               :bigint           not null, primary key
#  human_feedback   :text
#  human_status     :string           not null
#  student_response :text             not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  dataset_id       :integer          not null
#
module Evidence
  module Research
    module GenAI
      class PromptExample < ApplicationRecord
        HUMAN_STATUSES = [
          OPTIMAL = 'optimal',
          SUBOPTIMAL = 'suboptimal'
        ].freeze

        belongs_to :dataset

        validates :human_status, presence: true
        validates :student_response, presence: true
        validates :dataset_id, presence: true

        attr_readonly :human_status, :dataset_id, :student_response
      end
    end
  end
end
