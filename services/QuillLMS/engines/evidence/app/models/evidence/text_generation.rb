module Evidence
  class TextGeneration < ApplicationRecord
    DATA_ACCESSORS = [
      :source_text,
      :language,
      :word,
      :word_list,
      :ml_prompt,
      :count,
      :index,
      :temperature,
      :label,
      :stem,
      :conjunction,
      :noun
    ]

    store :data, accessors: DATA_ACCESSORS, coder: JSON
    has_many :prompt_texts

    validates :name, presence: true

    def seed_descriptor
      seed_descriptor_fields.compact.join("_").downcase
    end

    private def seed_descriptor_fields
      [name&.underscore, label, index, "temp", temperature, conjunction, noun]
    end

    def labeled_descriptor
      labeled_descriptor_fields.compact.join('-').downcase
    end

    private def labeled_descriptor_fields
      [name&.underscore, language, word]
    end
  end
end
