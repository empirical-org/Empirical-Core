# frozen_string_literal: true

module Evidence
  class SafeFirstLowercaser
    attr_reader :word_list

    COMMON_WORD_LIST = Evidence::Configs.from_yml(:common_lowercase_words)
    WORD_REGEX = /[\w']+/

    def initialize(passage = "")
      passage_lowercase_words = passage
        .scan(WORD_REGEX)
        .select {|i| i[0] == i[0].downcase}
        .map(&:downcase)

      @word_list = (COMMON_WORD_LIST + passage_lowercase_words).to_set
    end

    # Lowercase first word of text if it is a common word
    # or if it appears lowercase in the passage
    def run(text)
      first_word(text).in?(word_list) ? downcase_first_letter(text) : text
    end

    private def first_word(text)
      text.slice(WORD_REGEX)&.downcase
    end

    private def downcase_first_letter(text)
      text.sub(text[0], text[0].downcase)
    end
  end
end
