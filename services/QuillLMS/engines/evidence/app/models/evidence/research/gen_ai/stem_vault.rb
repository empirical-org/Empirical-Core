# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_stem_vaults
#
#  id          :bigint           not null, primary key
#  conjunction :string           not null
#  stem        :text             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  activity_id :integer          not null
#  prompt_id   :integer
#
module Evidence
  module Research
    module GenAI
      class StemVault < ApplicationRecord
        CONJUNCTIONS = [
          BECAUSE = 'because',
          BUT = 'but',
          SO = 'so'
        ].freeze

        RELEVANT_TEXTS = {
          BECAUSE => :because_text,
          BUT => :but_text,
          SO => :so_text
        }.freeze

        belongs_to :activity
        belongs_to :prompt, class_name: 'Evidence::Prompt', optional: true

        has_many :guidelines, dependent: :destroy
        has_many :datasets, dependent: :destroy
        has_many :trials, through: :datasets

        validates :stem, presence: true
        validates :conjunction, presence: true, inclusion: { in: CONJUNCTIONS }
        validates :activity_id, presence: true

        attr_readonly :stem, :conjunction, :activity_id

        delegate :name, :because_text, :but_text, :so_text, to: :activity

        store_accessor :automl_data, :confusion_matrix, :labels

        def set_confusion_matrix_and_labels! = update_automl_data!(ConfusionMatrixAndLabelsExtractor.run(prompt_id:))

        def update_automl_data!(new_data)
          self.automl_data ||= {}
          automl_data.merge!(new_data)
          save!
        end

        def serializable_hash(options = nil)
          options ||= {}
          super(options.reverse_merge(
            include: [:datasets]
          ))
        end

        def full_text = activity.text

        def relevant_text = send(RELEVANT_TEXTS[conjunction])

        def to_s = "#{name} - #{conjunction}"

        def stem_and_conjunction = "#{stem} #{conjunction}"
      end
    end
  end
end
