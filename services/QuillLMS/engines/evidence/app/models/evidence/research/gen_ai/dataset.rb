# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_datasets
#
#  id               :bigint           not null, primary key
#  locked           :boolean          default(FALSE), not null
#  optimal_count    :integer          default(0), not null
#  suboptimal_count :integer          default(0), not null
#  version          :integer          not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  parent_id        :integer
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
        belongs_to :parent, class_name: 'Evidence::Research::GenAI::Dataset', optional: true

        validates :optimal_count, presence: true
        validates :suboptimal_count, presence: true
        validates :stem_vault, presence: true
        validates :version, presence: true

        validate :validate_file_content

        attr_readonly :locked, :stem_vault_id, :optimal_count, :suboptimal_count, :version

        delegate :stem_and_conjunction, to: :stem_vault

        attr_accessor :file

        before_validation :set_version

        def dataslices = where(parent_id: id)

        def set_version
          existing_version = self.class.where(parent_id:, stem_vault:).order(version: :desc).first&.version
          self.version = existing_version.is_a?(Integer) ? existing_version + 1 : 1
        end

        def test_examples_count = optimal_count + suboptimal_count

        def to_s = "Dataset v#{version}"

        def validate_file_content
          return unless file.present?

          errors_message = DatasetValidator.run(file:)
          errors.add(:file, errors_message) if errors_message.present?
        end
      end
    end
  end
end
