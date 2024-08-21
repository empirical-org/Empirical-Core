# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_guidelines
#
#  id                         :bigint           not null, primary key
#  curriculum_assigned_status :string           not null
#  text                       :text             not null
#  visible                    :boolean          default(TRUE), not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  stem_vault_id              :integer          not null
#
module Evidence
  module Research
    module GenAI
      class Guideline < ApplicationRecord
        include HasAssignedStatus

        belongs_to :stem_vault

        attr_readonly :curriculum_assigned_status, :stem_vault_id, :text

        validates :curriculum_assigned_status, presence: true
        validates :stem_vault_id, presence: true
        validates :text, presence: true

        scope :visible, -> { where(visible: true) }
        scope :archived, -> { where(visible: false) }

        def self.assigned_status_column = :curriculum_assigned_status

        def to_s = text
      end
    end
  end
end
