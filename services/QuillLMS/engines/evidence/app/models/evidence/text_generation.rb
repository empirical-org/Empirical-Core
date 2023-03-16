module Evidence
  class TextGeneration < ApplicationRecord
    has_many :prompt_texts

    validates :name, presence: true
  end
end
