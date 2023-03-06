module Evidence
  class PromptTextGeneration < ApplicationRecord
    has_many :prompt_texts

    validates :generator, presence: true
  end
end
