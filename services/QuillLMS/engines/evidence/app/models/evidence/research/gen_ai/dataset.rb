# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_datasets
#
#  id               :bigint           not null, primary key
#  locked           :boolean          not null
#  optimal_count    :integer          not null
#  suboptimal_count :integer          not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  stem_vault_id    :integer          not null
#
module Evidence
  module Research
    module GenAI
      class Dataset < ApplicationRecord
        belongs_to :stem_vault

        validates :optimal_count, presence: true
        validates :suboptimal_count, presence: true
        validates :stem_vault, presence: true

        attr_readonly :locked, :stem_vault_id, :optimal_count, :suboptimal_count

        delegate :locked?, to: :locked
      end
    end
  end
end
