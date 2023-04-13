module Evidence
  class PromptText < ApplicationRecord
    belongs_to :prompt_text_batch
    belongs_to :text_generation

    validates :prompt_text_batch_id, presence: true
    validates :text_generation_id, presence: true
    validates :text, presence: true

    def seed_csv_row
      [text, seed_descriptor, seed_label]
    end

    def seed_label
      text_generation&.label
    end

    def seed_descriptor
      text_generation&.seed_descriptor
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

    def source_text
      text_generation&.source_text
    end

    def labeled_descriptor
      text_generation&.labeled_descriptor
    end
  end
end
