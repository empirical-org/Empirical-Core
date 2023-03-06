module Evidence
  class PromptText < ApplicationRecord
    belongs_to :prompt_text_batch
    belongs_to :prompt_text_generation

    validates :prompt_text_batch_id, presence: true
    validates :prompt_text_generation_id, presence: true
    validates :text, presence: true
  end
end
