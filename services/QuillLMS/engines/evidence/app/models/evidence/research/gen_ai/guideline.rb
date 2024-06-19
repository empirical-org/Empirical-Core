# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_guidelines
#
#  id            :bigint           not null, primary key
#  category      :string           not null
#  text          :text             not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  stem_vault_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class Guideline < ApplicationRecord
        CATEGORIES = [
          OPTIMAL = 'optimal',
          SUB_OPTIMAL = 'sub_optimal'
        ].freeze

        scope :optimal, -> { where(category: OPTIMAL) }
        scope :sub_optimal, -> { where(category: SUB_OPTIMAL) }

        belongs_to :stem_vault, class_name: 'Evidence::Research::GenAI::StemVault'

        attr_readonly :category, :stem_vault_id, :text

        validates :category, presence: true
        validates :stem_vault_id, presence: true
        validates :text, presence: true

        def to_s = text
      end
    end
  end
end
