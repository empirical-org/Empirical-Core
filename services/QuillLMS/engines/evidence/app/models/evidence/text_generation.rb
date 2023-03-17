module Evidence
  class TextGeneration < ApplicationRecord
    store :data,
      accessors: [:source_text, :language, :word, :word_list, :ml_prompt, :count, :index, :temperature, :label, :stem, :conjunction],
      coder: JSON
    has_many :prompt_texts

    validates :name, presence: true
  end
end
