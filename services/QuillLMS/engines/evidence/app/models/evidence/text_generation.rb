# frozen_string_literal: true

module Evidence
  class TextGeneration < ApplicationRecord
    # TODO, use STI for this in the future
    self.inheritance_column = :_type_disabled

    CONFIG_ACCESSORS = [
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

    store :config, accessors: CONFIG_ACCESSORS, coder: JSON
    has_many :prompt_texts

    TYPES = [
      TYPE_ORIGINAL = "Original",
      TYPE_FULL_PASSAGE = "FullPassage",
      TYPE_FULL_PASSAGE_NOUN = "FullPassageNoun",
      TYPE_PASSAGE_CHUNK = "PassageChunk",
      TYPE_LABEL_EXAMPLE = "LabelExample",
      TYPE_PARAPHRASE = "Paraphrase",
      TYPE_SPELLING = "Spelling",
      TYPE_SPELLING_PASSAGE = "SpellingPassage",
      TYPE_TRANSLATION = "Translation",
      TYPE_IMPORT = "Import"
    ]

    validates :type, presence: true, inclusion: {in: TYPES}

    scope :original, -> {where(type: TYPE_ORIGINAL)}

    def seed_descriptor
      seed_descriptor_fields.compact.join("_").downcase
    end

    private def seed_descriptor_fields
      [type&.underscore, label, index, "temp", temperature, conjunction, noun]
    end

    def labeled_descriptor
      labeled_descriptor_fields.compact.join('-').downcase
    end

    private def labeled_descriptor_fields
      [type&.underscore, language, word]
    end
  end
end
