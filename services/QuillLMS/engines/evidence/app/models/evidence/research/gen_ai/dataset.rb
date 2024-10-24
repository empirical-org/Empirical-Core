# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_datasets
#
#  id               :bigint           not null, primary key
#  locked           :boolean          default(FALSE), not null
#  notes            :text
#  optimal_count    :integer          default(0), not null
#  suboptimal_count :integer          default(0), not null
#  task_type        :string
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
        TASK_TYPES = [
          CLASSIFICATION = 'classification',
          GENERATIVE = 'generative'
        ].freeze

        has_many :test_examples, dependent: :destroy
        has_many :prompt_examples, dependent: :destroy
        has_many :trials, dependent: :destroy
        has_many :guidelines, dependent: :destroy
        has_many :comparisons, dependent: :destroy
        has_many :data_subsets, class_name: 'Evidence::Research::GenAI::Dataset', foreign_key: 'parent_id'

        belongs_to :stem_vault
        belongs_to :parent, class_name: 'Evidence::Research::GenAI::Dataset', optional: true

        validates :optimal_count, presence: true
        validates :suboptimal_count, presence: true
        validates :stem_vault, presence: true
        validates :version, presence: true

        validate :validate_file_content

        attr_readonly :locked, :stem_vault_id, :optimal_count, :suboptimal_count, :version, :task_type

        delegate :stem_and_conjunction, to: :stem_vault

        scope :whole, -> { where(parent_id: nil) }
        scope :classification, -> { where(task_type: CLASSIFICATION) }
        scope :generative, -> { where(task_type: GENERATIVE) }

        attr_accessor :file

        before_validation :set_version

        def whole? = parent_id.nil?
        def subset? = parent_id.present?
        def generative? = task_type == GENERATIVE
        def classification? = task_type == CLASSIFICATION

        def set_version
          existing_version = self.class.where(parent_id:, stem_vault:).order(version: :desc).first&.version
          self.version = existing_version.is_a?(Integer) ? existing_version + 1 : 1
        end

        def test_examples_count = optimal_count + suboptimal_count

        def to_s = whole? ? "Dataset v#{version}" : "Data Subset v#{version}"

        def validate_file_content
          return unless file.present?

          errors_message = DatasetValidator.run(file:)
          errors.add(:file, errors_message) if errors_message.present?
        end
      end
    end
  end
end
