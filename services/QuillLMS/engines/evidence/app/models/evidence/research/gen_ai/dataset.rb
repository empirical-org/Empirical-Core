# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_datasets
#
#  id               :bigint           not null, primary key
#  locked           :boolean          not null
#  optimal_count    :integer          not null
#  suboptimal_count :integer          not null
#  version          :integer          not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  stem_vault_id    :integer          not null
#
module Evidence
  module Research
    module GenAI
      class Dataset < ApplicationRecord
        has_many :test_examples, dependent: :destroy
        has_many :prompt_examples, dependent: :destroy
        has_many :trials, dependent: :destroy
        has_many :comparisons, dependent: :destroy

        belongs_to :stem_vault

        validates :optimal_count, presence: true
        validates :suboptimal_count, presence: true
        validates :stem_vault, presence: true
        validates :version, presence: true

        attr_readonly :locked, :stem_vault_id, :optimal_count, :suboptimal_count, :version

        attr_accessor :file

        before_validation :set_version

        def set_version
          existing_version = self.class.where(stem_vault: stem_vault).order(version: :desc).first&.version
          self.version = existing_version.is_a?(Integer) ? existing_version + 1 : 1
        end

        def test_examples_count = optimal_count + suboptimal_count

        def to_s = "#{stem_vault}, v#{version}"
      end
    end
  end
end
