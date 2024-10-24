# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_guidelines
#
#  id                         :bigint           not null, primary key
#  curriculum_assigned_status :string           not null
#  notes                      :text
#  text                       :text             not null
#  visible                    :boolean          default(TRUE), not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  dataset_id                 :integer
#
# Indexes
#
#  index_evidence_research_gen_ai_guidelines_on_dataset_id  (dataset_id)
#
module Evidence
  module Research
    module GenAI
      class Guideline < ApplicationRecord
        include HasAssignedStatus

        belongs_to :dataset

        attr_readonly :curriculum_assigned_status, :dataset_id, :text

        validates :curriculum_assigned_status, presence: true
        validates :dataset_id, presence: true
        validates :text, presence: true

        scope :visible, -> { where(visible: true) }
        scope :archived, -> { where(visible: false) }

        def self.assigned_status_column = :curriculum_assigned_status

        def to_s = text
      end
    end
  end
end
