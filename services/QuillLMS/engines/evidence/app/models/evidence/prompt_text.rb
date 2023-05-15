# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_prompt_texts
#
#  id                   :bigint           not null, primary key
#  prompt_text_batch_id :integer          not null
#  text_generation_id   :integer          not null
#  text                 :string           not null
#  label                :string
#  ml_type              :string
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#
module Evidence
  class PromptText < ApplicationRecord
    belongs_to :prompt_text_batch
    belongs_to :text_generation

    validates :prompt_text_batch_id, presence: true
    validates :text_generation_id, presence: true
    validates :text, presence: true

    delegate :seed_descriptor, :source_text, :labeled_descriptor, to: :text_generation

    def seed_csv_row
      [text, seed_descriptor, seed_label]
    end

    def seed_label
      text_generation&.label
    end

    def labeled_training_csv_row
      [ml_type, text, label]
    end

    def labeled_analysis_csv_row
      [
        text,
        label,
        source_text || '',
        text == source_text ? 'no_change' : '',
        labeled_descriptor,
        ml_type
      ]
    end
  end
end
