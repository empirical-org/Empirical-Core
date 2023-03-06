module Evidence
  class PromptTextBatch < ApplicationRecord
    # TODO, use STI for this in the future
    self.inheritance_column = :_type_disabled

    has_many :prompt_texts
    has_many :prompt_text_generations, through: :prompt_texts

    validates :type, presence: true
    validates :prompt_id, presence: true
    validates :user_id, presence: true
  end
end
