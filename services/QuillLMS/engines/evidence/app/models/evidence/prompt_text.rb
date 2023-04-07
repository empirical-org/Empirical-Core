module Evidence
  class PromptText < ApplicationRecord
    belongs_to :prompt_text_batch
    belongs_to :text_generation

    validates :prompt_text_batch_id, presence: true
    validates :text_generation_id, presence: true
    validates :text, presence: true

    def seed_csv_row
      [text, text_generation&.seed_descriptor, text_generation&.label]
    end

    def seed_label
      text_generation&.label
    end

    def seed_descriptor
      text_generation&.seed_descriptor
    end
  end
end
